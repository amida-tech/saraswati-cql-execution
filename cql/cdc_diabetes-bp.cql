library cdc_bp_lessThanOneHundredAndFortyOverNinety version '1'

using FHIR version '4.0.0'
include FHIRHelpers version '4.0.0' called FHIRHelpers

codesystem "SNOMED-CT": '2.16.840.1.113883.6.96' version '20200301'
codesystem "LOINC": 'http://loinc.org'

valueset "Acute Inpatient": '2.16.840.1.113762.1.4.1182.120'
valueset "Outpatient": '2.16.840.1.113883.3.464.1003.101.12.1008'
valueset "ED": '2.16.840.1.113883.3.464.1003.101.12.1085'
valueset "Observation Encounter": '2.16.840.1.113762.1.4.1181.72'
valueset "Nonacute Inpatient Stay": '2.16.840.1.113762.1.4.1182.289'
valueset "Telephone Visits": '2.16.840.1.113883.3.1444.5.216'
valueset "Online Assessments": '2.16.840.1.113883.3.7587.3.1013'
valueset "Nonacute Inpatient": '2.16.840.1.113883.3.464.1003.101.12.1084'
valueset "Hospice Encounter": '2.16.840.1.113883.3.464.1004.1761'
valueset "Hospice Intervention": '2.16.840.1.113762.1.4.1182.2'
valueset "Diabetes": '2.16.840.1.113883.3.464.1003.103.12.1001'
valueset "Telehealth Modifier": '2.16.840.1.113762.1.4.1138.731'
valueset "Telehealth POS": '2.16.840.1.113883.3.464.1003.101.11.1155'
valueset "Frailty Device": '2.16.840.1.113883.3.464.1003.118.12.1300'
valueset "Frailty Diagnosis": '2.16.840.1.113883.3.464.1003.113.11.1308'
valueset "Frailty Encounter": '2.16.840.1.113883.3.464.1003.101.12.1088'
valueset "Frailty Symptom": '2.16.840.1.113883.3.464.1003.113.12.1075'
valueset "Advanced Illness": '2.16.840.1.113883.3.464.1003.110.12.1082'
valueset "Inpatient Stay": '2.16.840.1.113762.1.4.1182.285'
valueset "Systolic Less Than 140": '2.16.840.1.113762.1.4.1182.85'
valueset "Systolic Greater Than Or Equal To 140": '2.16.840.1.113762.1.4.1182.84'
valueset "Diastolic Less Than 80": '2.16.840.1.113762.1.4.1182.79'
valueset "Diastolic Greater Than Or Equal To 90": '2.16.840.1.113762.1.4.1182.78'
valueset "Diastolic BP": '2.16.840.1.113762.1.4.1116.409'
valueset "Dementia Medications 1": '2.16.840.1.113883.3.464.1003.196.11.1517'
valueset "Dementia Medications 2": '2.16.840.1.113883.3.464.1003.196.12.1510'

// The following commented out valuesets are found in the HEDIS specifications,
// but don't exist in the value set authority or the NIH's database
// valueset "Remote Blood Pressure Monitoring": ''
// valueset "Hospice Encounter": ''

code "Blood pressure": '85354-9' from "LOINC" display 'blood pressure'
code "Diastolic blood pressure": '8462-4' from "LOINC" display 'Diastolic blood pressure'
code "Systolic blood pressure": '8480-6' from "LOINC" display 'Systolic blood pressure'

code "Acarbose": '386965004' from "SNOMED-CT"
code "Miglitol": '109071007' from "SNOMED-CT"
code "Insulin Aspart": '325072002' from "SNOMED-CT"

concept "Diabetes Medication": {
  "Acarbose",
  "Miglitol",
  "Insulin Aspart"
} display 'Diabetes Medication'

parameter MeasurementPeriod default Interval[@2018-12-31T00:00:00.0, @2019-12-31T00:00:00.0)
parameter MeasurementPeriodExtended default Interval[@2017-12-31T00:00:00.0, @2019-12-31T00:00:00.0)

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

define "Claim with Acute Inpatient":
  [Claim] C
    with C.diagnosis D such that D.diagnosis in "Acute Inpatient"

define "Acute Inpatient Discharge On Discharge Claim":
  exists ("Acute Inpatient Discharge With Diabetes" Enc
    with "Claim with Acute Inpatient" AI
      such that Enc.subject = AI.patient)

define "Nonacute Diabetes Discharges-List":
  distinct ([Encounter: "Nonacute Inpatient Stay"] E
    with [Condition: "Diabetes"] Dia
      such that E.status ~ 'finished')

define "Nonacute Diabetes Discharges":
  Count ("Nonacute Diabetes Discharges-List")

define "Claim with Nonacute Inpatient Stay":
  [Claim] C
    with C.diagnosis D such that D.diagnosis in "Nonacute Inpatient Stay"

define "Nonacute Diabetes Discharges On Claim":
  Count ("Nonacute Diabetes Discharges-List" E
    with "Claim with Nonacute Inpatient Stay" C
      such that E.subject = C.patient)

define "Outpatient Visit":
  [Encounter: "Outpatient"] E
    with [Condition: "Diabetes"] c
      such that E.period starts during MeasurementPeriodExtended

define "Observation Visit":
  [Encounter: "Observation Encounter"] E
    with [Condition: "Diabetes"] c
      such that E.period starts during MeasurementPeriodExtended

define "Out":
  [Encounter: "Telehealth POS"] E
    with [Condition: "Diabetes"] c
      such that E.period starts during MeasurementPeriodExtended

define "Telehealth Modifier With Diabetes":
  [Encounter: "Telehealth Modifier"] E
    with [Condition: "Diabetes"] c
      such that E.period starts during MeasurementPeriodExtended

define "Telephone Visit":
  [Encounter: "Telephone Visits"] E
    with [Condition: "Diabetes"] c
      such that E.period starts during MeasurementPeriodExtended

define "Online Assessment":
  [Encounter: "Online Assessments"] E
    with [Condition: "Diabetes"] c
      such that E.period starts during MeasurementPeriodExtended

define "Out Tele Online with Different Dates":
  from
    "Out" cond1,
    "Telehealth Modifier With Diabetes" cond2,
    "Telephone Visit" cond3,
    "Online Assessment" cond4,
    "Outpatient Visit" cond5,
    "Observation Visit" cond6
      where (cond1.period.start != cond2.period.start )
        and (cond1.period.start != cond3.period.start )
        and (cond1.period.start != cond4.period.start )
        and (cond1.period.start != cond5.period.start )
        and (cond1.period.start != cond6.period.start )
        and (cond2.period.start != cond3.period.start )
        and (cond2.period.start != cond4.period.start )
        and (cond2.period.start != cond5.period.start )
        and (cond2.period.start != cond6.period.start )
        and (cond3.period.start != cond4.period.start )
        and (cond3.period.start != cond5.period.start )
        and (cond3.period.start != cond6.period.start )
        and (cond4.period.start != cond5.period.start )
        and (cond4.period.start != cond6.period.start )
        and (cond5.period.start != cond6.period.start )
      return (exists(cond1) or exists(cond2) or exists(cond3) or exists(cond4))

define "Out Tele Online":
  case ("Out Tele Online with Different Dates")
    when true then 1
    else 0
  end

define "At Least 2 Remote or Nonacute Inpatient Encounters With Diabetes":
   "Nonacute Diabetes Discharges" + "Nonacute Diabetes Discharges On Claim" + "Out Tele Online" >= 2

define "Diabetes Diagnosis By Medication":
  exists([MedicationDispense] B
    with B.medication.coding X such that exists(
        B.medication.coding coding
          where FHIRHelpers.ToCode(coding) ~ "Diabetes Medication"
    )
    and B.status ~ 'completed')

define "Frailty":
  exists([Encounter: "Frailty Device"] D
    where D.period starts during MeasurementPeriod)
    or exists([Encounter: "Frailty Diagnosis"] Dia
      where Dia.period starts during MeasurementPeriod)
        or exists([Encounter: "Frailty Encounter"] E
          where E.period starts during MeasurementPeriod)
          or exists([Encounter: "Frailty Symptom"] S
            where S.period starts during MeasurementPeriod)

define "Acute Inpatient With Advanced Illness":
  exists ([Condition: "Advanced Illness"]) and  exists ([Encounter : "Acute Inpatient"])

define "Acute Inpatient Discharge With Advanced Illness":
  exists ([Encounter: "Acute Inpatient"] E
    with [Condition: "Advanced Illness"] AI
      such that E.status ~ 'finished')

define "Outpatient Advanced Illness":
  [Encounter: "Outpatient"] E
    with [Condition: "Advanced Illness"] AI
      such that E.period starts during MeasurementPeriodExtended

define "Observation Advanced Illness":
  [Encounter: "Observation Encounter"] E
    with [Condition: "Advanced Illness"] AI
      such that E.period starts during MeasurementPeriodExtended

define "ED Advanced Illness":
  [Encounter: "ED"] E
    with [Condition: "Advanced Illness"] AI
      such that E.period starts during MeasurementPeriodExtended

define "Nonacute AI":
  [Encounter: "Nonacute Inpatient"] E
    with [Condition: "Advanced Illness"] AI
      such that E.period starts during MeasurementPeriodExtended

define "Nonacute AI Discharge":
  [Encounter: "Nonacute Inpatient"] E
    with [Condition: "Advanced Illness"] AI
      such that E.status ~ 'finished'
      and E.period starts during MeasurementPeriodExtended

define "At Least Two Out/Obs/ED Advaned Illness":
  from
    "Outpatient Advanced Illness" OAI,
    "Observation Advanced Illness" ObsAI,
    "ED Advanced Illness" EDAI,
    "Nonacute AI" NAI,
    "Nonacute AI Discharge" NAID
    where (OAI.period.start != ObsAI.period.start)
      and (OAI.period.start != EDAI.period.start)
      and (OAI.period.start != NAI.period.start)
      and (OAI.period.start != NAID.period.start)
      and (ObsAI.period.start != EDAI.period.start)
      and (ObsAI.period.start != NAI.period.start)
      and (ObsAI.period.start != NAID.period.start)
      and (EDAI.period.start != NAI.period.start)
      and (EDAI.period.start != NAID.period.start)
      and (NAI.period.start != NAID.period.start)
      return (Count(((((OAI union ObsAI) union EDAI) union NAI) union NAID)) >= 2)

define "Taking Dementia Medication":
  exists([MedicationDispense] B
    with B.medication.coding X such that exists(
        B.medication.coding coding
          where (FHIRHelpers.ToCode(coding) in "Dementia Medications 1"
            or FHIRHelpers.ToCode(coding) in "Dementia Medications 2")
    ))

define "Diabetes Exclusions":
    AgeInYearsAt(start of MeasurementPeriod) >= 66
     and "Frailty"
     and ("Acute Inpatient Discharge With Advanced Illness"
      or "Acute Inpatient With Advanced Illness"
      or "At Least Two Out/Obs/ED Advaned Illness"
      or "Taking Dementia Medication")

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

define "Correct Context For BP Reading":
  exists([Encounter: "Outpatient"] O
    where O.period during MeasurementPeriod)
    or exists([Encounter: "Nonacute Inpatient Stay"] E
      where E.period during MeasurementPeriod)
      // or [Encounter: "Remote Blood Pressure Monitoring"] R
        // where R.period during MeasurementPeriod

define "Most Recent BP Reading Date":
  Last(["Observation": "Blood pressure"] BP 
    return FHIRHelpers.ToDateTime(Coalesce(BP.effective, BP.effective.start, BP.effective.event))
  )

define "Qualifying Diastolic Blood Pressure Reading":
	["Observation": "Blood pressure"] BloodPressure
	  where BloodPressure.status in {'final', 'amended'}
      and FHIRHelpers.ToDateTime(Coalesce(BloodPressure.effective, BloodPressure.effective.start, BloodPressure.effective.event)) same day as "Most Recent BP Reading Date"
      and Coalesce(BloodPressure.effective, BloodPressure.effective.start, BloodPressure.effective.event) during "MeasurementPeriod"
      and exists (
        BloodPressure.component DiastolicBP
          where FHIRHelpers.ToConcept(DiastolicBP.code) ~ "Diastolic blood pressure"
            and DiastolicBP.value.unit in {'mm[Hg]', 'mmHg'}
            and DiastolicBP.value.value.value < 90
      )

define "Qualifying Systolic Blood Pressure Reading":
	["Observation": "Blood pressure"] BloodPressure
	  where BloodPressure.status in {'final', 'amended'}
      and FHIRHelpers.ToDateTime(Coalesce(BloodPressure.effective, BloodPressure.effective.start, BloodPressure.effective.event)) same day as "Most Recent BP Reading Date"
      and Coalesce(BloodPressure.effective, BloodPressure.effective.start, BloodPressure.effective.event) during "MeasurementPeriod"
      and exists (
        BloodPressure.component SystolicBP
          where FHIRHelpers.ToConcept(SystolicBP.code) ~ "Systolic blood pressure"
            and SystolicBP.value.unit in {'mm[Hg]', 'mmHg'}
            and SystolicBP.value.value.value < 140
      )

define "BP < 140/90 mm Hg":
  "Correct Context For BP Reading"
  and exists("Qualifying Diastolic Blood Pressure Reading")
  and exists("Qualifying Systolic Blood Pressure Reading")

define "Numerator":
  case ("BP < 140/90 mm Hg" and "Diabetes Condition Numerator" and "Initial Population" and not "Diabetes Exclusions")
    when true then 1
    else 0
  end

define "Denominator":
  case ("Initial Population" and "Diabetes Condition Denominator")
    when true then 1
    else 0
  end

context Unfiltered

define "Denominator Count":
  Sum(Denominator)

define "Numerator Count":
  Sum(Numerator)

define "CDC Measure Score":
  Sum(Numerator) / Sum(Denominator)