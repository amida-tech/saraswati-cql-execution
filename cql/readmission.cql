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
  [ExplanationOfBenefit: "Inpatient Stay"] EOB
   with [Encounter] enc
    such that enc.status = 'finished'
    and enc.period starts during "Denominator Measurement Period"

define "Nonacute Inpatient Discharge List":
  [ExplanationOfBenefit: "Nonacute Inpatient Stay"] EOB
    with [Encounter] E
    such that E.status ~ 'finished'
    and E.period starts during "Denominator Measurement Period"

define "Observation Visit List":
  [ExplanationOfBenefit: "Nonacute Inpatient Stay"] EOB
    with [Encounter] E
    such that E.status ~'finished'
    and E.period starts during "Denominator Measurement Period"

define "Acute Discharge List":
  ("All Inpatient Discharge List" except "Nonacute Inpatient Discharge List")
    union "Observation Visit List"

define "All Discharge List":
  "All Inpatient Discharge List" union "Observation Visit List"

//Step 2
define "All Den Direct Transfers":
  from
    "Acute Discharge List" GAP,
    "Acute Discharge List" GAP2
    where getEncounter(GAP).subject = getEncounter(GAP2).subject
       and (days between getEncounter(GAP).period.end and getEncounter(GAP2).period.start <= 1)
       and getEncounter(GAP2).period.end <= "December of 2020"
  return GAP2

define "Final Den Direct Transfer":
  Last("All Den Direct Transfers")

define "Den Direct Transfers":
    "Acute Discharge List" except "All Den Direct Transfers" union {"Final Den Direct Transfer"}

//Step 3
define "Multi-Day Visits":
  "Den Direct Transfers" DT
    where (days between getEncounter(DT).period.end and getEncounter(DT).period.start > 1)

//Step 4
define "No Death or Pregnancy":
  "Multi-Day Visits" MDV
    where getEncounter(MDV).hospitalization.dischargeDisposition !~ "Patient deceased during stay"
      and not contains(getEncounter(MDV).reasonCode.coding, "Pregnancy")
        and not contains(getEncounter(MDV).reasonCode.coding, "Perinatal")

// Step 5 continuous enrollment
define "Continuous Enrollment":
  from
    "No Death or Pregnancy" NDOP,
    "All Discharge List" ALL
      where (getEncounter(ALL).period.end occurs 365 days or less before getEncounter(NDOP).period.end)
        or (getEncounter(ALL).period.end occurs 30 days or less after getEncounter(NDOP).period.end)
  return ALL

// Step 6 Remove hospital stays for outlier members
define "Remove Outliers":
  case getInsurance(First("Continuous Enrollment"))
    when 'Medicare' then if Count("Continuous Enrollment") < 4 then "Continuous Enrollment" else {}
    when 'Medicaid' then if Count("Continuous Enrollment") < 4 then "Continuous Enrollment" else {}
    else if Count("Continuous Enrollment") < 3 then "Continuous Enrollment" else {}
  end

// Step 7
define "Denominator Score":
  getDenominatorScore("Remove Outliers")

define function getDenominatorScore(eobs List<ExplanationOfBenefit>):
  case
    when Count("Remove Outliers") = 1 then "getEncounterScore"("Remove Outliers"[0])
    when Count("Remove Outliers") = 2 then "getEncounterScore"("Remove Outliers"[0]) + "getEncounterScore"("Remove Outliers"[1])
    when Count("Remove Outliers") = 3 then "getEncounterScore"("Remove Outliers"[0]) + "getEncounterScore"("Remove Outliers"[1]) + "getEncounterScore"("Remove Outliers"[2])
    else 0
  end

define function getEncounterScore(eob ExplanationOfBenefit):
  "AgeGenderWeight"(eob) + "surgeryOrObservation"(eob)

define function surgeryOrObservation(eob ExplanationOfBenefit):
  case
    when isObservation(eob) then getObservationWeight(eob)
    else getSurgeryWeight(eob)
  end

define function isObservation(eob ExplanationOfBenefit):
  eob in "Observation Visit List"

define function getObservationWeight(eob ExplanationOfBenefit):
  case getInsurance(eob)
    when 'Medicare' then if AgeInYearsAt(getEncounter(eob).period.end) < 65 then -0.1496 else -0.0970
    when 'Medicaid' then -0.0337
    else -0.6263
  end

define function getSurgeryWeight(eob ExplanationOfBenefit):
  -0.5

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

//Step 2
define "All Num Direct Transfers":
  from
    "Num Acute Discharge List" GAP,
    "Num Acute Discharge List" GAP2
    where GAP.subject = GAP2.subject
       and (days between GAP.period.end and GAP2.period.start <= 1)
       and GAP2.period.end <= "January of 2021"
  return GAP2

define "Final Num Direct Transfer":
  Last("All Num Direct Transfers")

define "Num Direct Transfers":
    "Num Acute Discharge List" except "All Num Direct Transfers" union {"Final Num Direct Transfer"}

// Step 3
define "Numerator Exclusions":
  [Encounter: "Chemotherapy"]
    union [Encounter: "Rehabilitation Services"]
    union [Encounter: "Rehabilitation Therapy"]
    union [Encounter: "Kidney Transplant"]
    union [Encounter: "Bone Marrow Transplant"]
    union [Encounter: "Organ Transplant"]

define "Num No Pregnancy":
  "Num Direct Transfers" NDT
    where NDT.hospitalization.dischargeDisposition !~ "Pregnancy"

define "Valid Num Encounters":
  "Num No Pregnancy" except "Numerator Exclusions"

// Step 4
define "Numerator":
  Count(from
    "Valid Num Encounters" NNP,
    "Continuous Enrollment" CE
      where days between getEncounter(CE).period.end and NNP.period.start <=30)

define function AgeGenderWeight(eob ExplanationOfBenefit):
  case getInsurance(eob)
    when 'Medicare' then medicareAgeGenderWeight(getEncounter(eob))
    when 'Medicaid' then medicaidAgeGenderWeight(getEncounter(eob))
    else commercialAgeGenderWeight(getEncounter(eob))
  end

define function medicareAgeGenderWeight(encounter Encounter):
  case
    when AgeInYearsAt(encounter.period.end) <= 44 then if isMale() then -2.1122 else -2.2225
    when AgeInYearsAt(encounter.period.end) <= 54 then if isMale() then -2.3449 else -2.2655
    when AgeInYearsAt(encounter.period.end) <= 64 then if isMale() then -2.2943 else -2.3833
    when AgeInYearsAt(encounter.period.end) <= 74 then if isMale() then -2.5745 else -2.5870
    when AgeInYearsAt(encounter.period.end) <= 84 then if isMale() then -2.4921 else -2.5367
    else if isMale() then -2.5397 else -2.5696
  end

define function medicaidAgeGenderWeight(encounter Encounter):
  case
    when AgeInYearsAt(encounter.period.end) <= 44 then if isMale() then -2.6788 else -2.7841
    when AgeInYearsAt(encounter.period.end) <= 54 then if isMale() then -2.6552 else -2.7211
    else if isMale() then -2.5792 else -2.6547
  end

define function commercialAgeGenderWeight(encounter Encounter):
  case
    when AgeInYearsAt(encounter.period.end) <= 44 then if isMale() then -2.3867 else -2.4909
    when AgeInYearsAt(encounter.period.end) <= 54 then if isMale() then -2.4489 else -2.4945
    else if isMale() then -2.4410 else -2.4661
  end

define function getInsurance(eob ExplanationOfBenefit):
  Last(([Coverage] cov where Last(eob.insurance).coverage.identifier in cov.identifier).type.text).value

define function isMale():
  Patient.gender in "Male Administrative Sex"

define function getEncounter(eob ExplanationOfBenefit):
  Last([Encounter] enc where Last(eob.item.encounter).identifier in enc.identifier)
