library readmission version '1'

using FHIR version '4.0.0'
include FHIRHelpers version '4.0.0' called FHIRHelpers

codesystem "SNOMEDCT": 'urn:oid:2.16.840.1.113883.6.96' version 'urn:hl7:version:2017-09'
codesystem "LOINC": 'http://loinc.org'

valueset "Inpatient Stay": '2.16.840.1.113762.1.4.1182.285'
valueset "Nonacute Inpatient Stay": '2.16.840.1.113762.1.4.1182.289'
valueset "Observation Encounter": '2.16.840.1.113762.1.4.1181.72'
valueset "Chemotherapy": '2.16.840.1.113762.1.4.1047.451'
valueset "Rehabilitation Services": '2.16.840.1.113883.3.117.1.7.1.229'
valueset "Rehabilitation Therapy": '2.16.840.1.113762.1.4.1045.19'
valueset "Kidney Transplant": '2.16.840.1.113883.3.464.1003.109.11.1024'
valueset "Bone Marrow Transplant": '2.16.840.1.113883.3.666.5.335'
valueset "Organ Transplant": '2.16.840.1.113883.3.666.5.358'
valueset "Female Administrative Sex": '2.16.840.1.113883.3.560.100.2'
valueset "Male Administrative Sex": '2.16.840.1.113883.3.560.100.1'

code "Patient deceased during stay": '371828006' from "SNOMEDCT" display 'Patient deceased during stay'
code "Pregnancy": '305386002' from "SNOMEDCT" display 'Pregnancy'
code "Perinatal": '183494008' from "SNOMEDCT" display 'Perinatal'
code "Comorbidity": '398192003' from "SNOMEDCT" display 'Comorbidity'

parameter "Denominator Measurement Period" default Interval[@2020-01-01T00:00:00.0, @2020-12-01T23:59:59.999)
parameter "Numerator Measurement Period" default Interval[@2020-01-03T00:00:00.0, @2020-12-31T23:59:59.999)

define "December of 2020":
   Date(2020, 12, 01)

define "January of 2021":
  Date(2021, 01, 01)

context Patient

//Denominator
//Step 1
define "All Inpatient Discharge List":
  [ExplanationOfBenefit] EOB
   with [Encounter: "Inpatient Stay"] enc
    such that enc.status = 'finished'
    and enc.period starts during "Denominator Measurement Period"

define "Nonacute Inpatient Discharge List":
  [ExplanationOfBenefit] EOB
    with [Encounter: "Nonacute Inpatient Stay"] E
      such that E.status ~ 'finished'
      and E.period starts during "Denominator Measurement Period"

define "Observation Visit List":
  [ExplanationOfBenefit] EOB
    with [Encounter: "Nonacute Inpatient Stay"] E
      such that E.status ~'finished'
      and E.period starts during "Denominator Measurement Period"

define "Acute Discharge List":
  ("All Inpatient Discharge List" except "Nonacute Inpatient Discharge List")
    union "Observation Visit List"

define "All Discharge List":
  "All Inpatient Discharge List" union "Observation Visit List"

//Step 2
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

define "Workaround Direct Transfers Count":
  Count("Workaround Direct Transfers")

//Step 3
define "Multi-Day Visits":
  "Workaround Direct Transfers" DT
    with [Encounter] enc
      such that duration in days of enc.period >= 1

define "Multi-Day Visits Count":
  Count("Multi-Day Visits")
//Step 4
define "No Death or Pregnancy":
  "Multi-Day Visits" MDV
    with [Encounter] enc
      such that enc.hospitalization.dischargeDisposition !~ "Patient deceased during stay"
      and not contains(enc.reasonCode.coding, "Pregnancy")
      and not contains(enc.reasonCode.coding, "Perinatal")

define "No Death or Pregnancy Count":
  Count("No Death or Pregnancy")
// Step 5 continuous enrollment
define "Continuous Enrollment":
  "No Death or Pregnancy" NDOP
    with [Encounter] enc
      such that hasContinuousEnrollment(enc)

define function hasContinuousEnrollment(enc Encounter):
  Exists([ExplanationOfBenefit] EOB
    with [Encounter] enc2
      such that (enc2.period.end occurs 365 days or less before enc.period.end)
      or (enc2.period.end occurs 30 days or less after enc.period.end))

define "Continuous Enrollment Count":
  Count("Continuous Enrollment")

// Step 6 Remove hospital stays for outlier members
define "Final Denominator List":
  case getInsurance(First("Continuous Enrollment"))
    when 'Medicare' then if Count("Continuous Enrollment") < 4 then "Continuous Enrollment" else List<ExplanationOfBenefit>{}
    when 'Medicaid' then if Count("Continuous Enrollment") < 4 then "Continuous Enrollment" else List<ExplanationOfBenefit>{}
    else if Count("Continuous Enrollment") < 3 then "Continuous Enrollment" else List<ExplanationOfBenefit>{}
  end

define "Print0":
  ("Final Denominator List"[0] as ExplanationOfBenefit).billablePeriod.end

define "Print0-1":
  ("Final Denominator List"[1] as ExplanationOfBenefit).billablePeriod.end

define "Cast Denominator List":
  "Final Denominator List" as List<ExplanationOfBenefit>

define "Denominator Tuple":
  "Cast Denominator List" CDL with [Encounter] enc such that 1=1 return Tuple { id: CDL.id, period: CDL.billablePeriod}

// Step 7
define "Denominator Score":
  Count("Final Denominator List")

//Numerator
//Step 1
define "Num All Inpatient Discharge List":
  [Encounter: "Inpatient Stay"] Enc
    where Enc.status = 'finished'
    and Enc.period starts during "Numerator Measurement Period"

define "Num Nonacute Inpatient Discharge List":
  [Encounter: "Nonacute Inpatient Stay"] E
    where E.status ~ 'finished'
    and E.period starts during "Numerator Measurement Period"

define "Num Observation Visit List":
  [Encounter: "Observation Encounter"] E
    where E.status ~'finished'
    and E.period starts during "Numerator Measurement Period"

define "Num Acute Discharge List":
  ("Num All Inpatient Discharge List" except "Num Nonacute Inpatient Discharge List")
    union "Num Observation Visit List"

define "Num Acute Discharge List Count":
  Count("Num Acute Discharge List")

//Step 2
define "Num Direct Transfers":
  "Num Acute Discharge List" GAP
    with [Encounter] enc
    such that not numNonLastDirectTransfer(enc)

define function numNonLastDirectTransfer(enc Encounter):
  Exists("Num Acute Discharge List" ADL
    with [Encounter] enc2
      such that enc.subject = enc2.subject
      and (days between enc.period.end and enc2.period.start <= 1))

define "Num Workaround Direct Transfers":
  case Count("Num Acute Discharge List")
    when 0 then {}
    when 1 then {"Num Acute Discharge List"[0]}
    else "Num Acute Discharge List"
  end
// Step 3
define "Numerator Exclusions":
  [Encounter: "Chemotherapy"]
    union [Encounter: "Rehabilitation Services"]
    union [Encounter: "Rehabilitation Therapy"]
    union [Encounter: "Kidney Transplant"]
    union [Encounter: "Bone Marrow Transplant"]
    union [Encounter: "Organ Transplant"]

define "Num No Pregnancy":
  "Num Workaround Direct Transfers" NDT
    where (NDT as Encounter).hospitalization.dischargeDisposition !~ "Pregnancy"

define "Valid Num Encounters":
  "Num No Pregnancy" except "Numerator Exclusions"

define "Valid Num Encounters Count":
  Count("Valid Num Encounters")

// Step 4
define "Print1":
  ("Valid Num Encounters"[0] as Encounter).period.end

define "Print1-1":
  ("Valid Num Encounters"[1] as Encounter).period.end

define "Final Numerator List":
  "Denominator Tuple" FDL where hasReadmission(FDL.period)

define function hasReadmission(denPeriod Period):
  Exists("Valid Num Encounters" numEnc
    where numEnc.period != denPeriod
    and days between denPeriod.end and numEnc.period.start <= 30)

define "Numerator":
  Count("Final Numerator List")

define function getInsurance(eob ExplanationOfBenefit):
  Last(([Coverage] cov where Last(eob.insurance).coverage.identifier in cov.identifier).type.text).value

define function getEncounter(eob ExplanationOfBenefit):
  Last([Encounter] enc where Last(eob.item.encounter).identifier in enc.identifier)
