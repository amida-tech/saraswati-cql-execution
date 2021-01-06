library CDC_HbA1c_lessthan8 version '1'

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
// the HbA1c valuesets and hospice encounter don't have the OID we'll need IRL (will add later)
valueset "HbA1c Level Less Than 7.0": 'urn:oid:2.16.840.1.113883.3.464.1004.1115'
valueset "HbA1c Level Greater Than or Equal to 7.0 and Less Than 8.0": 'urn:oid:2.16.840.1.113883.3.464.1004.1976'
valueset "Hospice Encounter": 'urn:oid:2.16.840.1.113883.3.464.1004.1761'
valueset "Hospice Intervention": 'urn:oid:2.16.840.1.113762.1.4.1182.2'
valueset "Diabetes": 'urn:oid:2.16.840.1.113883.3.464.1003.103.12.1001'
valueset "HbA1c Lab Test": 'urn:oid:2.16.840.1.113883.3.464.1003.198.11.1024'
valueset "Telehealth Modifier": 'urn:oid:2.16.840.1.113762.1.4.1138.731'
valueset "Telehealth POS": 'urn:oid:2.16.840.1.113883.3.464.1003.101.11.1155'
valueset "Frailty Device": 'urn:oid:2.16.840.1.113883.3.464.1003.118.12.1300'
// the frailty diagnosis doesn't have the OID we'll need IRL (will add later)
valueset "Frailty Diagnosis": 'urn:oid:2.16.840.1.113883.3.464.1004.1531'
valueset "Frailty Encounter": 'urn:oid:2.16.840.1.113883.3.464.1003.101.12.1088'
valueset "Frailty Symptom": 'urn:oid:2.16.840.1.113883.3.464.1003.113.12.1075'
valueset "Advanced Illness": 'urn:oid:2.16.840.1.113883.3.464.1003.110.12.1082'
valueset "Inpatient Stay": 'urn:oid:2.16.840.1.113762.1.4.1182.285'

code "Acarbose_code": '386965004' from "SNOMED-CT"
code "Miglitol": '109071007' from "SNOMED-CT"
code "insulin aspart": '325072002' from "SNOMED-CT"

concept "diabetes medication": {
  "Acarbose_code",
  "Miglitol",
  "insulin aspart"
} display 'diabetes medication'

parameter MeasurementPeriod default Interval[@2018-12-31T00:00:00.0, @2019-12-31T00:00:00.0)

context Patient

define "InitialPopulation":
  AgeInYearsAt(start of MeasurementPeriod) >= 18 and AgeInYearsAt(start of MeasurementPeriod) <= 75

define "telehealth modifier":
  exists ([Encounter: "Telehealth Modifier"] E
    where E.period starts during MeasurementPeriod)

define "telehealth POS":
  exists ([Encounter: "Telehealth POS"] E
    where E.period starts during MeasurementPeriod)

define "acute inpatient encounter":
  exists ([Encounter: "Acute Inpatient"] E
    with [Condition: "Diabetes"] D
    such that E.period starts during MeasurementPeriod)

define "acute inpatient encounter without telehealth":
  "acute inpatient encounter"
    and not "telehealth POS"
    and not "telehealth modifier"

define "acute inpatient discharge with diabetes":
  [Encounter: "Acute Inpatient"] Enc
    with [Condition: "Diabetes"] Dia
      such that Enc.status = 'finished'
      and Enc.period starts during MeasurementPeriod

define "acute inpatient discharge on discharge claim":
  exists ("acute inpatient discharge with diabetes" Enc
    with [Claim: "Acute Inpatient"] AI
      such that Enc.subject = AI.patient)

	define "nonacute diabetes discharges-list":
  distinct ([Encounter: "Nonacute Inpatient Stay"] E
    with [Condition: "Diabetes"] Dia
      such that E.status ~ 'finished')

define "nonacute diabetes discharges":
  Count("nonacute diabetes discharges-list")

define "nonacute diabetes discharges on claim":
  Count ("nonacute diabetes discharges-list" E
    with [Claim: "Nonacute Inpatient Stay"] C
      such that E.subject = C.patient)

define "out":
  exists ([Encounter: "Telehealth POS"] E
    with [Condition: "Diabetes"] c
      such that E.period starts during MeasurementPeriod)

define "tele":
  exists ([Encounter: "Telehealth Modifier"] E
    with [Condition: "Diabetes"] c
      such that E.period starts during MeasurementPeriod)

define "telephone vis":
  exists ([Encounter: "Telephone Visits"] E
    with [Condition: "Diabetes"] c
      such that E.period starts during MeasurementPeriod)

define "online assess":
  exists ([Encounter: "Online Assessments"] E
    with [Condition: "Diabetes"] c
      such that E.period starts during MeasurementPeriod)

define "out-tele-online":
  case ("out" or "tele" or "telephone vis" or "online assess")
    when true then 1
    else 0
  end

define "atleast 2 remote or nonacute inpatient encounters with diabetes":
   "nonacute diabetes discharges" + "nonacute diabetes discharges on claim" + "out-tele-online" >= 2

define "diabetes diagnosis by medication":
  //TODO: figure out how to do medication dynamically to avoid version control conflict
  exists([MedicationDispense] A
    where A.medication = "Acarbose_code"
    and A.status ~ 'completed')
    or exists([MedicationDispense] B
      where B.medication = "Miglitol"
      and B.status ~ 'completed')
      or exists([MedicationDispense] C
        where C.medication = "insulin aspart"
        and C.status ~ 'completed')

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

define "diabetes exclusions":
    "Frailty" and ("Acute inpatient discharge with Advanced Illness" or "Acute Inpatient with Advanced Illness")
    // TODO: atleast 2 outpatients w/ advanced Illness

define "DiabetesCondition":
  "acute inpatient encounter without telehealth"
    or "acute inpatient discharge on discharge claim"
    or "atleast 2 remote or nonacute inpatient encounters with diabetes"
    or "diabetes diagnosis by medication"

define "HbA1c < 8":
  exists(Last([Observation: "HbA1c Lab Test"] O
    where O.value < 8))

define "numerator":
  case ("HbA1c < 8" and "DiabetesCondition" and "InitialPopulation" and not "diabetes exclusions")
    when true then 1
    else 0
  end

define "denominator":
  case ("InitialPopulation" and "DiabetesCondition")
    when true then 1
    else 0
  end

context Unfiltered

define "denominator_count":
  Sum(denominator)

define "numerator_count":
  Sum(numerator)

define "CDC_MeasureScore":
  Sum(numerator) / Sum(denominator)