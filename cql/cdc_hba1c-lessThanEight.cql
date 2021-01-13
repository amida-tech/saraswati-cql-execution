library cdc_hba1c_lessThanEight version '1'

using FHIR version '4.0.0'
include FHIRHelpers version '4.0.0' called FHIRHelpers


codesystem "SNOMED-CT": 'urn:oid:2.16.840.1.113883.6.96' version '20200301'

valueset "Acute Inpatient": 'urn:oid:2.16.840.1.113762.1.4.1182.120'
valueset "Outpatient": 'urn:oid:2.16.840.1.113883.3.464.1003.101.12.1008'
valueset "ED": 'urn:oid:2.16.840.1.113883.3.464.1003.101.12.1085'
valueset "Observation": 'urn:oid:2.16.840.1.113762.1.4.1181.72'
valueset "Nonacute Inpatient Stay": 'urn:oid:2.16.840.1.113762.1.4.1182.289'
valueset "Telephone Visits": 'urn:oid:2.16.840.1.113883.3.1444.5.216'
valueset "Online Assessments": 'urn:oid:2.16.840.1.113883.3.7587.3.1013'
valueset "Nonacute Inpatient": 'urn:oid:2.16.840.1.113883.3.464.1003.101.12.1084'
// The following commented out valuesets are found in the HEDIS specifications,
// but don't exist in the value set authority or the NIH's database
// and aren't necessary to calculate the HbA1c value.
// Just using the HbA1c Lab Value does the same thing
/*
valueset "HbA1c Level Less Than 7.0": 'urn:oid:2.16.840.1.113883.3.464.1004.1115'
valueset "HbA1c Level Greater Than or Equal to 7.0 and Less Than 8.0": 'urn:oid:2.16.840.1.113883.3.464.1004.1976'
valueset "Hospice Encounter": 'urn:oid:2.16.840.1.113883.3.464.1004.1761'
valueset "Hospice Intervention": 'urn:oid:2.16.840.1.113762.1.4.1182.2'
*/
valueset "Diabetes": 'urn:oid:2.16.840.1.113883.3.464.1003.103.12.1001'
valueset "HbA1c Lab Test": 'urn:oid:2.16.840.1.113883.3.464.1003.198.11.1024'
valueset "Telehealth Modifier": 'urn:oid:2.16.840.1.113762.1.4.1138.731'
valueset "Telehealth POS": 'urn:oid:2.16.840.1.113883.3.464.1003.101.11.1155'
valueset "Frailty Device": 'urn:oid:2.16.840.1.113883.3.464.1003.118.12.1300'
valueset "Frailty Diagnosis": 'urn:oid:2.16.840.1.113883.3.464.1003.113.11.1308'
valueset "Frailty Encounter": 'urn:oid:2.16.840.1.113883.3.464.1003.101.12.1088'
valueset "Frailty Symptom": 'urn:oid:2.16.840.1.113883.3.464.1003.113.12.1075'
valueset "Advanced Illness": 'urn:oid:2.16.840.1.113883.3.464.1003.110.12.1082'
valueset "Inpatient Stay": 'urn:oid:2.16.840.1.113762.1.4.1182.285'

code "Acarbose": '386965004' from "SNOMED-CT"
code "Miglitol": '109071007' from "SNOMED-CT"
code "Insulin Aspart": '325072002' from "SNOMED-CT"

concept "Diabetes Medication": {
  "Acarbose",
  "Miglitol",
  "Insulin Aspart"
} display 'Diabetes Medication'

parameter MeasurementPeriodExtended default Interval[@2017-12-31T00:00:00.0, @2019-12-31T00:00:00.0)
parameter MeasurementPeriod default Interval[@2018-12-31T00:00:00.0, @2019-12-31T00:00:00.0)

context Patient

define "Initial Population":
  AgeInYearsAt(start of MeasurementPeriod) >= 18 and AgeInYearsAt(start of MeasurementPeriod) <= 75

define "Telehealth Modifier Encounter":
  exists ([Encounter: "Telehealth Modifier"] E
    where E.period starts during MeasurementPeriodExtended)

define "Telehealth POS Encounter":
  exists ([Encounter: "Telehealth POS"] E
    where E.period starts during MeasurementPeriodExtended)

define "Acute Inpatient Encounter":
  exists ([Encounter: "Acute Inpatient"] E
    with [Condition: "Diabetes"] D
    such that E.period starts during MeasurementPeriodExtended)

define "Acute Inpatient Encounter Without Telehealth":
  "Acute Inpatient Encounter"
    and not "Telehealth POS Encounter"
    and not "Telehealth Modifier Encounter"

define "Acute Inpatient Discharge With Diabetes":
  [Encounter: "Acute Inpatient"] Enc
    with [Condition: "Diabetes"] Dia
      such that Enc.status = 'finished'
      and Enc.period starts during MeasurementPeriodExtended

define "Acute Inpatient Discharge On Discharge Claim":
  exists ("Acute Inpatient Discharge With Diabetes" Enc
    with [Claim: "Acute Inpatient"] AI
      such that Enc.subject = AI.patient)

define "Nonacute Diabetes Discharges-List":
  distinct ([Encounter: "Nonacute Inpatient Stay"] E
    with [Condition: "Diabetes"] Dia
      such that E.status ~ 'finished')

define "Nonacute Diabetes Discharges":
  Count("Nonacute Diabetes Discharges-List")

define "Nonacute Diabetes Discharges On Claim":
  Count ("Nonacute Diabetes Discharges-List" E
    with [Claim: "Nonacute Inpatient Stay"] C
      such that E.subject = C.patient)

define "Out":
  exists ([Encounter: "Telehealth POS"] E
    with [Condition: "Diabetes"] c
      such that E.period starts during MeasurementPeriodExtended)

define "Telehealth Modifier With Diabetes":
  exists ([Encounter: "Telehealth Modifier"] E
    with [Condition: "Diabetes"] c
      such that E.period starts during MeasurementPeriodExtended)

define "Telephone Visit":
  exists ([Encounter: "Telephone Visits"] E
    with [Condition: "Diabetes"] c
      such that E.period starts during MeasurementPeriodExtended)

define "Online Assessment":
  exists ([Encounter: "Online Assessments"] E
    with [Condition: "Diabetes"] c
      such that E.period starts during MeasurementPeriodExtended)

define "Out Tele Online":
  case ("Out" or "Telehealth Modifier With Diabetes" or "Telephone Visit" or "Online Assessment")
    when true then 1
    else 0
  end

define "At Least 2 Remote or Nonacute Inpatient Encounters With Diabetes":
   "Nonacute Diabetes Discharges" + "Nonacute Diabetes Discharges On Claim" + "Out Tele Online" >= 2

define "Diabetes Diagnosis By Medication":
  //TODO: figure out how to do medication dynamically to avoid version control conflict
  exists([MedicationDispense] A
    where exists(A.medication ~ "Acarbose"
    and A.status ~ 'completed'))
    or exists([MedicationDispense] B
      where exists(B.medication ~ "Miglitol"
      and B.status ~ 'completed'))
      or exists([MedicationDispense] C
        where exists(C.medication ~ "Insulin Aspart"
        and C.status ~ 'completed'))

define "Frailty":
  exists([Encounter: "Frailty Device"] D
    where D.period starts during MeasurementPeriod)
    or exists([Encounter: "Frailty Diagnosis"] Dia
      where Dia.period starts during MeasurementPeriod)
        or exists([Encounter: "Frailty Encounter"] E
          where E.period starts during MeasurementPeriod)
          or exists([Encounter: "Frailty Symptom"] S
            where S.period starts during MeasurementPeriod)
              //TODO: age > 66

define "Acute Inpatient with Advanced Illness":
  exists ([Condition: "Advanced Illness"]) and  exists ([Encounter : "Acute Inpatient"])

define "Acute inpatient discharge with Advanced Illness":
  exists ([Encounter: "Acute Inpatient"] E
    with [Condition: "Advanced Illness"] AI
      such that E.status ~ 'finished')

define "Diabetes Exclusions":
    "Frailty" and ("Acute inpatient discharge with Advanced Illness" or "Acute Inpatient with Advanced Illness")
    // TODO: atleast 2 outpatients w/ advanced Illness

define "Diabetes Condition":
  "Acute Inpatient Encounter Without Telehealth"
    or "Acute Inpatient Discharge On Discharge Claim"
    or "At Least 2 Remote or Nonacute Inpatient Encounters With Diabetes"
    or "Diabetes Diagnosis By Medication"

define "Diabetes Condition Numerator":
  "Diabetes Condition"
    or "Diabetes Diagnosis By Medication"

define "Diabetes Condition Denominator":
  "Diabetes Condition"
    and "Diabetes Diagnosis By Medication"

define "HbA1c < 8":
  exists(Last([Observation: "HbA1c Lab Test"] O
    where O.value < 8 and Coalesce(O.effective, O.effective.start) during MeasurementPeriod))

define "Numerator":
  case ("HbA1c < 8" and "Diabetes Condition Numerator" and "Initial Population" and not "Diabetes Exclusions")
    when true then 1
    else 0
  end

define "Denominator":
  case ("Initial Population" and "Diabetes Condition Denominator")
    when true then 1
    else 0
  end

context Unfiltered

define "denominator_count":
  Sum(Denominator)

define "numerator_count":
  Sum(Numerator)

define "CDC_MeasureScore":
  Sum(Numerator) / Sum(Denominator)