library cdc_bp_lessThanOneHundredAndFortyOverNinety version '1'

using FHIR version '4.0.0'
include FHIRHelpers version '4.0.0'
include MATGlobalCommonFunctions_FHIR4 version '4.0.000' called Global


codesystem "SNOMED-CT": '2.16.840.1.113883.6.96' version '20200301'
codesystem "LOINC": 'http://loinc.org'


valueset "Acute Inpatient": '2.16.840.1.113762.1.4.1182.120'
valueset "Outpatient": '2.16.840.1.113883.3.464.1003.101.12.1008'
valueset "ED": '2.16.840.1.113883.3.464.1003.101.12.1085'
valueset "Observation": '2.16.840.1.113762.1.4.1181.72'
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

define "Acute Inpatient Discharge On Discharge Claim":
  exists ("Acute Inpatient Discharge With Diabetes" Enc
    with [Claim: "Acute Inpatient"] AI
      such that Enc.subject = AI.patient)

define "Nonacute Diabetes Discharges-List":
  distinct ([Encounter: "Nonacute Inpatient Stay"] E
    with [Condition: "Diabetes"] Dia
      such that E.status ~ 'finished')

define "Nonacute Diabetes Discharges":
  Count ("Nonacute Diabetes Discharges-List")

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

define "Out-Tele-Online":
  case ("Out" or "Telehealth Modifier Encounter" or "Telephone Visit" or "Online Assessment")
    when true then 1
    else 0
  end

define "At Least 2 Remote or Nonacute Inpatient Encounters With Diabetes":
   "Nonacute Diabetes Discharges" + "Nonacute Diabetes Discharges On Claim" + "Out-Tele-Online" >= 2

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

define "Acute Inpatient With Advanced Illness":
  exists ([Condition: "Advanced Illness"]) and  exists ([Encounter : "Acute Inpatient"])

define "Acute Inpatient Discharge With Advanced Illness":
  exists ([Encounter: "Acute Inpatient"] E
    with [Condition: "Advanced Illness"] AI
      such that E.status ~ 'finished')

define "Diabetes exclusions":
    "Frailty" and ("Acute Inpatient Discharge With Advanced Illness" or "Acute Inpatient With Advanced Illness")
    // TODO: at least 2 outpatients w/ advanced Illness

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
        
define "Qualifying Diastolic Blood Pressure Reading":	
	["Observation": "Blood pressure"] BloodPressure	
	  where BloodPressure.status in {'final', 'amended'}	
      and Coalesce(BloodPressure.effective, BloodPressure.effective.start) during "MeasurementPeriod"	
      and exists (	
        BloodPressure.component DiastolicBP	
          where FHIRHelpers.ToConcept(DiastolicBP.code) ~ "Diastolic blood pressure"	
            and DiastolicBP.value.unit in {'mm[Hg]', 'mmHg'}	
            and DiastolicBP.value.value.value < 90	
      )	
      	
define "Qualifying Systolic Blood Pressure Reading":	
	["Observation": "Blood pressure"] BloodPressure	
	  where BloodPressure.status in {'final', 'amended'}	
      and Coalesce(BloodPressure.effective, BloodPressure.effective.start) during "MeasurementPeriod"	
      and exists (	
        BloodPressure.component SystolicBP	
          where FHIRHelpers.ToConcept(SystolicBP.code) ~ "Systolic blood pressure"	
            and SystolicBP.value.unit in {'mm[Hg]', 'mmHg'}	
            and SystolicBP.value.value.value < 140	
      )

define "BP < 140/90 mm Hg":	
  exists("Correct Context For BP Reading") 	
  and exists("Qualifying Diastolic Blood Pressure Reading")	
  and exists("Qualifying Systolic Blood Pressure Reading")

define "Numerator":
  case ("BP < 140/90 mm Hg" and "Diabetes Condition Numerator" and "Initial Population" and not "Diabetes exclusions")
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