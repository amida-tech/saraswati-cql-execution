library readmission version '1'

using FHIR version '4.0.0'
include FHIRHelpers version '4.0.0' called FHIRHelpers

codesystem "SNOMEDCT": 'urn:oid:2.16.840.1.113883.6.96' version 'urn:hl7:version:2017-09'

valueset "Bone Marrow Transplant": '2.16.840.1.113883.3.666.5.335'
valueset "Chemotherapy": '2.16.840.1.113762.1.4.1047.451'
valueset "Inpatient Stay": '2.16.840.1.113762.1.4.1182.285'
valueset "Inpatient Obstetrics NDNQI": '2.16.840.1.113883.3.2066.2062'
valueset "Kidney Transplant": '2.16.840.1.113883.3.464.1003.109.11.1024'
valueset "Nonacute Inpatient Stay": '2.16.840.1.113762.1.4.1182.289'
valueset "Observation Stay": '2.16.840.1.113762.1.4.1181.72'
valueset "Organ Transplant": '2.16.840.1.113883.3.666.5.358'
valueset "Rehabilitation Services": '2.16.840.1.113883.3.117.1.7.1.229'
valueset "Rehabilitation Therapy": '2.16.840.1.113762.1.4.1045.19'

code "Patient deceased during stay": '371828006' from "SNOMEDCT" display 'Patient deceased during stay'

parameter "Denominator Measurement Period" default Interval[@2020-01-01T00:00:00.0, @2020-12-01T00:00:00)
parameter "Numerator Measurement Period" default Interval[@2020-01-03T00:00:00.0, @2020-12-31T23:59:59.999)

context Patient
//****************************************************************************//
//Denominator
//Step 1 all acute inpatient and obervation stays with no non-acute inpatiant
define "Denominator Gen Pop":
  [ExplanationOfBenefit] EOB
    where (hasInpatientEncounter(EOB) or hasObservationEncounter(EOB))
    and not hasNonAcuteInpatientEncounter(EOB)
    and startsDuringDenomPeriod(getEncounter(EOB))

define function hasInpatientEncounter(eob ExplanationOfBenefit):
  Exists(([Encounter: "Inpatient Stay"] enc where Substring(eob.item[0].encounter[0].reference.value, 9) = enc.id))

define function hasNonAcuteInpatientEncounter(eob ExplanationOfBenefit):
  Exists(([Encounter: "Nonacute Inpatient Stay"] enc where Substring(eob.item[0].encounter[0].reference.value, 9) = enc.id))

define function hasObservationEncounter(eob ExplanationOfBenefit):
  Exists(([Encounter: "Observation Stay"] enc where Substring(eob.item[0].encounter[0].reference.value, 9) = enc.id))

define function startsDuringDenomPeriod(denEnc Encounter):
  denEnc.status ~ 'finished' and denEnc.period starts during "Denominator Measurement Period"

//Step 2 Remove direct transfers but keep the last one
define "Den Direct Transfers":
  "Denominator Gen Pop" GAP where not nonLastDirectTransfer(getEncounter(GAP))

define function nonLastDirectTransfer(enc Encounter):
  Exists("Denominator Gen Pop" ADL
      where enc.id != getEncounter(ADL).id
      and (days between enc.period.end and getEncounter(ADL).period.start <= 1)
      and enc.period.start before getEncounter(ADL).period.start)

/*
define "Workaround Direct Transfers":
  case Count("Denominator Gen Pop")
    when 0 then List<ExplanationOfBenefit>{}
    when 1 then {"Denominator Gen Pop"[0]}
    else {"Denominator Gen Pop"[0], "Denominator Gen Pop"[1]}
  end
*/


//Step 3 -  Remove everyone who leaves the same day they arrive
define "Multi-Day Visits":
  "Den Direct Transfers" DT where duration in days of getEncounter(DT).period >= 1

//Step 4 - Nobody who died during their stay or is pregnant
define "No Death or Pregnancy":
  "Multi-Day Visits" MDV
    where not hasDiedDuringStay(getEncounter(MDV))
    and not hasPregnancyEncounter(MDV)

define function hasDiedDuringStay(enc Encounter):
  case getCountWithNull(enc)
    when 0 then false
    else '371828006' in enc.hospitalization.dischargeDisposition.coding.code.value
  end

define function getCountWithNull(enc Encounter):
  case
    when enc.hospitalization is null then 0
    when enc.hospitalization.dischargeDisposition is null then 0
    else Count(enc.hospitalization.dischargeDisposition.coding.code)
  end

define function hasPregnancyEncounter(eob ExplanationOfBenefit):
  Exists(([Encounter: "Inpatient Obstetrics NDNQI"] enc where Substring(eob.item[0].encounter[0].reference.value, 9) = enc.id))

// Step 5 continuous enrollment a year before and 30 days after
define "Continuous Enrollment":
  "No Death or Pregnancy" NDOP where hasContinuousEnrollment(getEncounter(NDOP))

define function hasContinuousEnrollment(enc Encounter):
  Exists([Encounter] enc2
    where enc.id != enc2.id
    and ((enc2.period.end occurs 365 days or less before enc.period.end)
      or (enc2.period.end occurs 30 days or less after enc.period.end)))

// Step 6 Remove hospital stays if you go to the hospital too much
define "Final Denominator List":
  case getInsurance(First("Continuous Enrollment"))
    when 'Medicare' then if Count("Continuous Enrollment") < 4 then "Continuous Enrollment" else List<ExplanationOfBenefit>{}
    when 'Medicaid' then if Count("Continuous Enrollment") < 4 then "Continuous Enrollment" else List<ExplanationOfBenefit>{}
    else if Count("Continuous Enrollment") < 3 then "Continuous Enrollment" else List<ExplanationOfBenefit>{}
  end

// Step 7 Count of all stays remaining
define "Denominator":
  Count("Final Denominator List")

//****************************************************************************//
//Numerator
//Step 1 all acute inpatient and obervation stays with no non-acute inpatiant
define "Numerator Gen Pop":
  (([Encounter: "Inpatient Stay"] union [Encounter: "Observation Stay"])
      except [Encounter: "Nonacute Inpatient Stay"]
  ) TotalStays
  where TotalStays.status ~ 'finished'
  and TotalStays.period starts during "Numerator Measurement Period"

//Step 2 Remove direct transfers but keep the last one
define "Num Direct Transfers":
  "Numerator Gen Pop" NumGenPop
    where not numNonLastDirectTransfer(NumGenPop)

define function numNonLastDirectTransfer(enc Encounter):
  Exists("Numerator Gen Pop" enc2
    where enc.id != enc2.id
    and (days between enc.period.end and enc2.period.start <= 1)
    and enc.period.start before enc2.period.start)

/*
define "Num Workaround Direct Transfers":
  case Count("Numerator Gen Pop")
    when 0 then List<Encounter>{}
    when 1 then {"Numerator Gen Pop"[0]}
    else "Numerator Gen Pop"
  end
*/

// Step 3 - Exlcude various encounters
define "Numerator Exclusions":
  [Encounter: "Chemotherapy"]
    union [Encounter: "Rehabilitation Services"]
    union [Encounter: "Rehabilitation Therapy"]
    union [Encounter: "Kidney Transplant"]
    union [Encounter: "Bone Marrow Transplant"]
    union [Encounter: "Organ Transplant"]
    union [Encounter: "Inpatient Obstetrics NDNQI"]

define "Valid Num Encounters":
  "Num Direct Transfers" except "Numerator Exclusions"

// Step 4 - Check the denominator for numerator encounters withing 30 days
define "Final Numerator List":
  "Final Denominator List" FDL where hasReadmission(getEncounter(FDL))

define function hasReadmission(denEnc Encounter):
  Exists("Valid Num Encounters" numEnc
    where numEnc.id != denEnc.id
    and days between denEnc.period.end and numEnc.period.start <= 30)

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

define "Readmission HEDIS Score":
  "Numerator Total" / "Denominator Total"
