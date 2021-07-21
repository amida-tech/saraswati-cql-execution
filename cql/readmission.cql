library readmission version '1'

using FHIR version '4.0.0'
include FHIRHelpers version '4.0.0' called FHIRHelpers

codesystem "SNOMEDCT": 'urn:oid:2.16.840.1.113883.6.96' version 'urn:hl7:version:2017-09'

valueset "Bone Marrow Transplant": '2.16.840.1.113883.3.666.5.335'
valueset "Chemotherapy": '2.16.840.1.113762.1.4.1047.451'
valueset "Inpatient Stay": '2.16.840.1.113762.1.4.1182.285'
valueset "Kidney Transplant": '2.16.840.1.113883.3.464.1003.109.11.1024'
valueset "Nonacute Inpatient Stay": '2.16.840.1.113762.1.4.1182.289'
valueset "Observation Stay": '2.16.840.1.113762.1.4.1181.72'
valueset "Organ Transplant": '2.16.840.1.113883.3.666.5.358'
valueset "Rehabilitation Services": '2.16.840.1.113883.3.117.1.7.1.229'
valueset "Rehabilitation Therapy": '2.16.840.1.113762.1.4.1045.19'

code "Patient deceased during stay": '371828006' from "SNOMEDCT" display 'Patient deceased during stay'
code "Perinatal": '183494008' from "SNOMEDCT" display 'Perinatal'
code "Pregnancy": '305386002' from "SNOMEDCT" display 'Pregnancy'

parameter "Denominator Measurement Period" default Interval[@2020-01-01T00:00:00.0, @2020-12-01T23:59:59.999)
parameter "Numerator Measurement Period" default Interval[@2020-01-03T00:00:00.0, @2020-12-31T23:59:59.999)

context Patient
//****************************************************************************//
//Denominator
//Step 1 all acute inpatient and obervation stays with no non-acute inpatiant
define "All Inpatient Discharge List":
  [ExplanationOfBenefit] EOB
   with [Encounter: "Inpatient Stay"] enc
    such that enc.status ~ 'finished'
    and enc.period starts during "Denominator Measurement Period"

define "Nonacute Inpatient Discharge List":
  [ExplanationOfBenefit] EOB
    with [Encounter: "Nonacute Inpatient Stay"] E
      such that E.status ~ 'finished'
      and E.period starts during "Denominator Measurement Period"

define "Observation Visit List":
  [ExplanationOfBenefit] EOB
    with [Encounter: "Observation Stay"] E
      such that E.status ~ 'finished'
      and E.period starts during "Denominator Measurement Period"

define "Acute Discharge List":
  ("All Inpatient Discharge List" except "Nonacute Inpatient Discharge List")
    union "Observation Visit List"

define "All Discharge List":
  "All Inpatient Discharge List" union "Observation Visit List"

//Step 2 Remove direct transfers but keep the last one
define "Den Direct Transfers":
  "All Discharge List" GAP
    with [Encounter] enc
      such that not nonLastDirectTransfer(enc)

define function nonLastDirectTransfer(enc Encounter):
  Exists("Acute Discharge List" ADL
    with [Encounter] enc2
      such that enc.id != enc2.id
      //and enc.subject = enc2.subject
      and (days between enc.period.end and enc2.period.start <= 1))

define "Workaround Direct Transfers":
  case Count("All Discharge List")
    when 0 then List<ExplanationOfBenefit>{}
    when 1 then {"All Discharge List"[0]}
    else {"All Discharge List"[0], "All Discharge List"[1]}
  end

//Step 3 -  Remove everyone who leaves the same day they arrive
define "Multi-Day Visits":
  "Workaround Direct Transfers" DT
    with [Encounter] enc
      such that duration in days of enc.period >= 1

//Step 4 - Nobody who died during their stay or is pregnant
define "No Death or Pregnancy":
  "Multi-Day Visits" MDV
    with [Encounter] enc
      such that enc.hospitalization.dischargeDisposition !~ "Patient deceased during stay"
      and not contains(enc.reasonCode.coding, "Pregnancy")
      and not contains(enc.reasonCode.coding, "Perinatal")

// Step 5 continuous enrollment a year before and 30 days after
define "Continuous Enrollment":
  "No Death or Pregnancy" NDOP
    with [Encounter] enc
      such that hasContinuousEnrollment(enc)

define function hasContinuousEnrollment(enc Encounter):
  Exists([ExplanationOfBenefit] EOB
    with [Encounter] enc2
      such that (enc2.period.end occurs 365 days or less before enc.period.end)
      or (enc2.period.end occurs 30 days or less after enc.period.end))

// Step 6 Remove hospital stays if you go to the hospital too much
define "Final Denominator List":
  case getInsurance(First("Continuous Enrollment"))
    when 'Medicare' then if Count("Continuous Enrollment") < 4 then "Continuous Enrollment" else List<ExplanationOfBenefit>{}
    when 'Medicaid' then if Count("Continuous Enrollment") < 4 then "Continuous Enrollment" else List<ExplanationOfBenefit>{}
    else if Count("Continuous Enrollment") < 3 then "Continuous Enrollment" else List<ExplanationOfBenefit>{}
  end

define "Cast Denominator List":
  "Final Denominator List" as List<ExplanationOfBenefit>

define "Denominator Tuple":
  "Cast Denominator List" CDL with [Encounter] enc such that 1=1
  return Tuple { id: getEncounter(CDL).id, period: getEncounter(CDL).period}

// Step 7 Count of all stays remaining
define "Denominator":
  Count("Final Denominator List")

//****************************************************************************//
//Numerator
//Step 1 all acute inpatient and obervation stays with no non-acute inpatiant
define "Numerator Gen Pop":
  ([Encounter: "Inpatient Stay"]
    union [Encounter: "Observation Stay"]
      except [Encounter: "Nonacute Inpatient Stay"]
  ) TotalStays
  where TotalStays.status ~ 'finished'
  and TotalStays.period starts during "Numerator Measurement Period"

//Step 2 Remove direct transfers but keep the last one
define "Num Direct Transfers":
  "Numerator Gen Pop" GAP
    with [Encounter] enc
    such that not numNonLastDirectTransfer(enc)

define function numNonLastDirectTransfer(enc Encounter):
  Exists("Numerator Gen Pop" ADL
    with [Encounter] enc2
      such that enc.subject = enc2.subject
      and (days between enc.period.end and enc2.period.start <= 1))

define "Num Workaround Direct Transfers":
  case Count("Numerator Gen Pop")
    when 0 then List<Encounter>{}
    when 1 then {"Numerator Gen Pop"[0]}
    else "Numerator Gen Pop"
  end

// Step 3 - Exlcude various encounters
define "Numerator Exclusions":
  [Encounter: "Chemotherapy"]
    union [Encounter: "Rehabilitation Services"]
    union [Encounter: "Rehabilitation Therapy"]
    union [Encounter: "Kidney Transplant"]
    union [Encounter: "Bone Marrow Transplant"]
    union [Encounter: "Organ Transplant"]

define "Num No Pregnancy":
  "Num Workaround Direct Transfers" NDT
    where NDT.hospitalization.dischargeDisposition !~ "Pregnancy"

define "Valid Num Encounters":
  "Num No Pregnancy" except "Numerator Exclusions"

// Step 4 - Check the denominator for numerator encounters withing 30 days
define "Final Numerator List":
  "Denominator Tuple" FDL where hasReadmission(FDL.id, FDL.period)

define function hasReadmission(denId id, denPeriod Period):
  Exists("Valid Num Encounters" numEnc
    where numEnc.id != denId
    and numEnc.period != denPeriod
    and days between denPeriod.end and numEnc.period.start <= 30)

define "Numerator":
  Count("Final Numerator List")

//****************************************************************************//
define function getInsurance(eob ExplanationOfBenefit):
  eob.insurance[0].coverage.display.value

define function getEncounter(eob ExplanationOfBenefit):
  ([Encounter] enc where Substring(eob.item[0].encounter[0].reference.value, 9) = enc.id)[0]

//****************************************************************************//
context Unfiltered

define "Denominator Total":
  Sum("Denominator")

define "Numerator Total":
  Sum(Numerator)

define "CDC Measure Score":
  "Numerator Total" / "Denominator Total"
