library cdc_bp_lessThanOneHundredAndFortyOverNinety version '1'

using FHIR version '4.0.0'
include FHIRHelpers version '4.0.0' called FHIRHelpers
include Diabetes_Library version '4.0.0' called Diabetes_Library

codesystem "LOINC": 'http://loinc.org'

valueset "Nonacute Inpatient Stay": '2.16.840.1.113762.1.4.1182.289'
valueset "Outpatient": '2.16.840.1.113883.3.464.1003.101.12.1008'


// The following commented out valuesets are found in the HEDIS specifications,
// but don't exist in the value set authority or the NIH's database
// and aren't necessary to calculate the HbA1c value.
// Just using the HbA1c Lab Value does the same thing
/*
valueset "Remote Blood Pressure Monitoring": ''
valueset "Hospice Encounter": ''
valueset "Hospice Encounter": '2.16.840.1.113883.3.464.1004.1761'
valueset "Hospice Intervention": '2.16.840.1.113762.1.4.1182.2'
*/
code "Blood pressure": '85354-9' from "LOINC" display 'blood pressure'
code "Diastolic blood pressure": '8462-4' from "LOINC" display 'Diastolic blood pressure'
code "Systolic blood pressure": '8480-6' from "LOINC" display 'Systolic blood pressure'

context Patient

define "Initial Population":
  Diabetes_Library."Initial Population"

define "Telehealth Modifier Encounter":
  Diabetes_Library."Telehealth Modifier Encounter"

define "Telehealth POS Encounter":
  Diabetes_Library."Telehealth POS Encounter"

define "Acute Inpatient Encounter":
  Diabetes_Library."Acute Inpatient Encounter"

define "Acute Inpatient Encounter Without Telehealth":
  Diabetes_Library."Acute Inpatient Encounter Without Telehealth"

define "Acute Inpatient Discharge With Diabetes":
  Diabetes_Library."Acute Inpatient Discharge With Diabetes"

define "Claim with Acute Inpatient":
  Diabetes_Library."Claim with Acute Inpatient"

// because we have a "Acute Inpatient" value set, we do not need to do 1, 2 or 3 for this bullet point
define "Acute Inpatient Discharge On Discharge Claim":
  Diabetes_Library."Acute Inpatient Discharge On Discharge Claim"

define "Nonacute Diabetes Discharges-List":
  Diabetes_Library."Nonacute Diabetes Discharges-List"

define "Claim with Nonacute Inpatient Stay":
  Diabetes_Library."Claim with Nonacute Inpatient Stay"

define "Nonacute Diabetes Discharges On Claim":
  Diabetes_Library."Nonacute Diabetes Discharges On Claim"

define "Outpatient Visit":
  Diabetes_Library."Outpatient Visit"

define "Observation Visit":
  Diabetes_Library."Observation Visit"

define "Telehealth POS With Diabetes":
  Diabetes_Library."Telehealth POS With Diabetes"

define "Telehealth Modifier With Diabetes":
  Diabetes_Library."Telehealth Modifier With Diabetes"

define "Telephone Visit":
  Diabetes_Library."Telephone Visit"

define "Online Assessment":
  Diabetes_Library."Online Assessment"

define "Emergency Department Visits":
  Diabetes_Library."Emergency Department Visits"

define "Out Tele Online Union":
  Diabetes_Library."Out Tele Online Union"

define "Out Visits Deduplicated Dates":
  Diabetes_Library."Out Visits Deduplicated Dates"

// because we have a "Nonacute Inpatient Stay"  valueset, we can skip identifying a nonacute inpatient discharge (1,2,3)
define "At Least 2 Remote or Nonacute Inpatient Encounters With Diabetes":
  Diabetes_Library."At Least 2 Remote or Nonacute Inpatient Encounters With Diabetes"

define "Diabetes Diagnosis By Medication":
  Diabetes_Library."Diabetes Diagnosis By Medication"

define "Frailty":
  Diabetes_Library."Frailty"

define "Acute Inpatient With Advanced Illness":
  Diabetes_Library."Acute Inpatient With Advanced Illness"

define "Acute Inpatient Discharge With Advanced Illness":
  Diabetes_Library."Acute Inpatient Discharge With Advanced Illness"

define "Outpatient Advanced Illness":
  Diabetes_Library."Outpatient Advanced Illness"

define "Observation Advanced Illness":
  Diabetes_Library."Observation Advanced Illness"

define "ED Advanced Illness":
  Diabetes_Library."ED Advanced Illness"

define "Nonacute AI":
  Diabetes_Library."Nonacute AI"

define "Nonacute AI Discharge":
  Diabetes_Library."Nonacute AI Discharge"

// Because we have a "nonacute inpatient" valueset, we can skip 1,2, and 3
define "At Least Two Out/Obs/ED Advaned Illness":
  Diabetes_Library."At Least Two Out/Obs/ED Advaned Illness"

define "Taking Dementia Medication":
  Diabetes_Library."Taking Dementia Medication"
// Event/diagnosis
define "Is Living Long Term in Institution":
  Diabetes_Library."Is Living Long Term in Institution"

// Exclusion
define "Diabetes Exclusions":
  Diabetes_Library."Diabetes Exclusions"

define "Diabetes Condition":
  Diabetes_Library."Diabetes Condition"

define "Diabetes Condition Numerator":
  Diabetes_Library."Diabetes Condition Numerator"

define "Diabetes Condition Denominator":
  Diabetes_Library."Diabetes Condition Denominator"

define "Correct Context For BP Reading":
  exists([Encounter: "Outpatient"] O
    where O.period during Diabetes_Library."Measurement Period")
    or exists([Encounter: "Nonacute Inpatient Stay"] E
      where E.period during Diabetes_Library."Measurement Period")
      // or [Encounter: "Remote Blood Pressure Monitoring"] R
        // where R.period during "Measurement Period"

define "Most Recent BP Reading Date":
  Last([Observation: "Blood pressure"] BP 
    return FHIRHelpers.ToDateTime(Coalesce(BP.effective, BP.effective.start, BP.effective.event))
  )
// Considering only compliant value sets for Diastolic
define "Qualifying Diastolic Blood Pressure Reading":
  [Observation: "Blood pressure"] BloodPressure
    where BloodPressure.status in {'final', 'amended'}
      and FHIRHelpers.ToDateTime(Coalesce(BloodPressure.effective, BloodPressure.effective.start, BloodPressure.effective.event)) same day as "Most Recent BP Reading Date"
      and Coalesce(BloodPressure.effective, BloodPressure.effective.start, BloodPressure.effective.event) during Diabetes_Library."Measurement Period"
      and exists (
        BloodPressure.component DiastolicBP
          where FHIRHelpers.ToConcept(DiastolicBP.code) ~ "Diastolic blood pressure"
            and DiastolicBP.value.unit in {'mm[Hg]', 'mmHg'}
            and DiastolicBP.value.value.value < 90
      )
// Considering only compliant value sets for Systolic
define "Qualifying Systolic Blood Pressure Reading":
  [Observation: "Blood pressure"] BloodPressure
    where BloodPressure.status in {'final', 'amended'}
      and FHIRHelpers.ToDateTime(Coalesce(BloodPressure.effective, BloodPressure.effective.start, BloodPressure.effective.event)) same day as "Most Recent BP Reading Date"
      and Coalesce(BloodPressure.effective, BloodPressure.effective.start, BloodPressure.effective.event) during Diabetes_Library."Measurement Period"
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
  case ("Initial Population" and "Diabetes Condition Denominator" and not "Diabetes Exclusions")
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
