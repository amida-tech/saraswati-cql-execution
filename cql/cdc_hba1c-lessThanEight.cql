library cdc_hba1c_lessThanEight version '1'

using FHIR version '4.0.0'
include FHIRHelpers version '4.0.0' called FHIRHelpers

codesystem "SNOMED-CT": 'http://snomed.info/sct' version '20200301'

valueset "Acute Inpatient": '2.16.840.1.113762.1.4.1182.120'
valueset "Advanced Illness": '2.16.840.1.113883.3.464.1003.110.12.1082'
valueset "Care Services in Long-Term Residential Facility": '2.16.840.1.113883.3.464.1003.101.12.1014'
valueset "Dementia Medications 1": '2.16.840.1.113883.3.464.1003.196.11.1517'
valueset "Dementia Medications 2": '2.16.840.1.113883.3.464.1003.196.12.1510'
valueset "Diabetes": '2.16.840.1.113883.3.464.1003.103.12.1001'
valueset "ED": '2.16.840.1.113883.3.464.1003.101.12.1085'
valueset "Encounter Inpatient": '2.16.840.1.113883.3.666.5.307'
valueset "Frailty Device": '2.16.840.1.113883.3.464.1003.118.12.1300'
valueset "Frailty Diagnosis": '2.16.840.1.113883.3.464.1003.113.11.1308'
valueset "Frailty Encounter": '2.16.840.1.113883.3.464.1003.101.12.1088'
valueset "Frailty Symptom": '2.16.840.1.113883.3.464.1003.113.12.1075'
valueset "HbA1c Lab Test": '2.16.840.1.113883.3.464.1003.198.11.1024'
valueset "Inpatient Stay": '2.16.840.1.113762.1.4.1182.285'
valueset "Nonacute Inpatient": '2.16.840.1.113883.3.464.1003.101.12.1084'
valueset "Nonacute Inpatient Stay": '2.16.840.1.113762.1.4.1182.289'
valueset "Observation Encounter": '2.16.840.1.113762.1.4.1181.72'
valueset "Online Assessments": '2.16.840.1.113883.3.7587.3.1013'
valueset "Outpatient": '2.16.840.1.113883.3.464.1003.101.12.1008'
valueset "Patients Age 65 or Older in SNP or Long Term Care": '2.16.840.1.113762.1.4.1182.66'
valueset "Telehealth Modifier": '2.16.840.1.113762.1.4.1138.731'
valueset "Telehealth POS": '2.16.840.1.113883.3.464.1003.101.11.1155'
valueset "Telephone Visits": '2.16.840.1.113883.3.1444.5.216'

// The following commented out valuesets are found in the HEDIS specifications,
// but don't exist in the value set authority or the NIH's database
// and aren't necessary to calculate the HbA1c value.
// Just using the HbA1c Lab Value does the same thing
/*
valueset "HbA1c Level Less Than 7.0": '2.16.840.1.113883.3.464.1004.1115'
valueset "HbA1c Level Greater Than or Equal to 7.0 and Less Than 8.0": '2.16.840.1.113883.3.464.1004.1976'
valueset "Hospice Encounter": '2.16.840.1.113883.3.464.1004.1761'
valueset "Hospice Intervention": '2.16.840.1.113762.1.4.1182.2'
*/

// TODO: there are more asthma medications needed than are listed here
// See Missing Medication Codes section in README for details
code "Acarbose": '386965004' from "SNOMED-CT" display 'Acarbose'
code "Miglitol": '109071007' from "SNOMED-CT" display 'Miglitol'
code "Insulin Aspart": '325072002' from "SNOMED-CT" display 'Insulin Aspart'
concept "Diabetes Medication": {
  "Acarbose",
  "Miglitol",
  "Insulin Aspart"
} display 'Diabetes Medication'

code "Patient transfer, to another health care facility (procedure)": '19712007' from "SNOMED-CT" display 'Patient transfer, to another health care facility (procedure)'
code "Referral to long term care service (procedure)": '417708006' from "SNOMED-CT" display 'Referral to long term care service (procedure)'
concept "Long Term Stay": {
  "Patient transfer, to another health care facility (procedure)",
  "Referral to long term care service (procedure)"
} display 'Long Term Stay'

parameter "Measurement Period" default Interval[@2020-01-01T00:00:00.0, @2020-12-31T23:59:59.999)
parameter "Measurement Period Extended" default Interval[@2019-01-01T00:00:00.0, @2020-12-31T23:59:59.999)

context Patient

define "Initial Population":
  AgeInYearsAt(start of "Measurement Period") >= 18 and AgeInYearsAt(start of "Measurement Period") <= 75

define "Telehealth Modifier Encounter":
  exists ([Encounter: "Telehealth Modifier"] E
    where E.period starts during "Measurement Period Extended")

define "Telehealth POS Encounter":
  exists ([Encounter: "Telehealth POS"] E
    where E.period starts during "Measurement Period Extended")

define "Acute Inpatient Encounter":
  exists ([Encounter: "Acute Inpatient"] E
    with [Condition: "Diabetes"] D
    such that E.period starts during "Measurement Period Extended")

define "Acute Inpatient Encounter Without Telehealth":
  "Acute Inpatient Encounter"
    and not "Telehealth POS Encounter"
    and not "Telehealth Modifier Encounter"

define "Acute Inpatient Discharge With Diabetes":
  [Encounter: "Acute Inpatient"] Enc
    with [Condition: "Diabetes"] Dia
      such that Enc.status = 'finished'
      and Enc.period starts during "Measurement Period Extended"

define "Claim with Acute Inpatient":
  [Claim] C
    with C.diagnosis D such that D.diagnosis in "Acute Inpatient"

// because we have a "Acute Inpatient" value set, we do not need to do 1, 2 or 3 for this bullet point
define "Acute Inpatient Discharge On Discharge Claim":
  exists ("Acute Inpatient Discharge With Diabetes" Enc
    with "Claim with Acute Inpatient" AI
      such that Enc.subject = AI.patient)

define "Nonacute Diabetes Discharges-List":
  distinct ([Encounter: "Nonacute Inpatient Stay"] E
    with [Condition: "Diabetes"] Dia
      such that E.status ~ 'finished')
      /* and not "Telehealth POS Encounter"
      and not "Telehealth Modifier Encounter" */

define "Claim with Nonacute Inpatient Stay":
  [Claim] C
    with C.diagnosis D such that D.diagnosis in "Nonacute Inpatient Stay"

define "Nonacute Diabetes Discharges On Claim":
  "Nonacute Diabetes Discharges-List" E
    with "Claim with Nonacute Inpatient Stay" C
      such that E.subject = C.patient

define "Outpatient Visit":
  [Encounter: "Outpatient"] E
    with [Condition: "Diabetes"] c
      such that E.period starts during "Measurement Period Extended"

define "Observation Visit":
  [Encounter: "Observation Encounter"] E
    with [Condition: "Diabetes"] c
      such that E.period starts during "Measurement Period Extended"

define "Telehealth POS With Diabetes":
  [Encounter: "Telehealth POS"] E
    with [Condition: "Diabetes"] c
      such that E.period starts during "Measurement Period Extended"

define "Telehealth Modifier With Diabetes":
  [Encounter: "Telehealth Modifier"] E
    with [Condition: "Diabetes"] c
      such that E.period starts during "Measurement Period Extended"

define "Telephone Visit":
  [Encounter: "Telephone Visits"] E
    with [Condition: "Diabetes"] c
      such that E.period starts during "Measurement Period Extended"

define "Online Assessment":
  [Encounter: "Online Assessments"] E
    with [Condition: "Diabetes"] c
      such that E.period starts during "Measurement Period Extended"

define "Emergency Department Visits":
  [Encounter: "ED"] E
    with [Condition: "Diabetes"] c
      such that E.period starts during "Measurement Period Extended"

define "Out Tele Online Union":
  case exists("Telehealth Modifier With Diabetes" union "Telephone Visit" union "Online Assessment" union "Telehealth POS With Diabetes")
    when true then 1
    else 0
  end

define function DeduplicateBasedOnStartDate(Enc List<Encounter>):
  if Count(Enc) > 1 then 
    "Enc" N1
      with "Enc" N2
        such that (IndexOf("Enc", N2) + 1 = IndexOf("Enc", N1))
          and not (N1.period.start = N2.period.start)
  else Enc[0]

define "Out Visits Deduplicated Dates":
  ("Outpatient Visit" union
  "Observation Visit" union
  "Emergency Department Visits" union
  "Nonacute Diabetes Discharges-List" union
  "Nonacute Diabetes Discharges On Claim") OutVisits
  return ToDate(OutVisits.period.start)

// because we have a "Nonacute Inpatient Stay"  valueset, we can skip identifying a nonacute inpatient discharge (1,2,3)
define "At Least 2 Remote or Nonacute Inpatient Encounters With Diabetes":
  "Out Tele Online Union" + Count("Out Visits Deduplicated Dates") >= 2

define "Diabetes Diagnosis By Medication":
  exists([MedicationDispense] MedicationDispense
    where FHIRHelpers.ToCode(MedicationDispense.medication.coding) ~ "Diabetes Medication")

define "Frailty":
  exists([Encounter: "Frailty Device"] D
    where D.period starts during "Measurement Period")
    or exists([Encounter: "Frailty Diagnosis"] Dia
      where Dia.period starts during "Measurement Period")
        or exists([Encounter: "Frailty Encounter"] E
          where E.period starts during "Measurement Period")
          or exists([Encounter: "Frailty Symptom"] S
            where S.period starts during "Measurement Period")

define "Acute Inpatient With Advanced Illness":
  exists ([Condition: "Advanced Illness"]) and  exists ([Encounter : "Acute Inpatient"])

define "Acute Inpatient Discharge With Advanced Illness":
  exists ([Encounter: "Acute Inpatient"] E
    with [Condition: "Advanced Illness"] AI
      such that E.status ~ 'finished')

define "Outpatient Advanced Illness":
  [Encounter: "Outpatient"] E
    with [Condition: "Advanced Illness"] AI
      such that E.period starts during "Measurement Period Extended"

define "Observation Advanced Illness":
  [Encounter: "Observation Encounter"] E
    with [Condition: "Advanced Illness"] AI
      such that E.period starts during "Measurement Period Extended"

define "ED Advanced Illness":
  [Encounter: "ED"] E
    with [Condition: "Advanced Illness"] AI
      such that E.period starts during "Measurement Period Extended"

define "Nonacute AI":
  [Encounter: "Nonacute Inpatient"] E
    with [Condition: "Advanced Illness"] AI
      such that E.period starts during "Measurement Period Extended"

define "Nonacute AI Discharge":
  [Encounter: "Nonacute Inpatient"] E
    with [Condition: "Advanced Illness"] AI
      such that E.status ~ 'finished'
      and E.period starts during "Measurement Period Extended"

// Because we have a "nonacute inpatient" valueset, we can skip 1,2, and 3
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
  exists([MedicationDispense] MedicationDispense
    where FHIRHelpers.ToCode(MedicationDispense.medication.coding) in "Dementia Medications 1"
      or FHIRHelpers.ToCode(MedicationDispense.medication.coding) in "Dementia Medications 2")

// Event/diagnosis
define "Is Living Long Term in Institution":
  exists([Encounter: "Encounter Inpatient"] DischargeLongTerm
    where FHIRHelpers.ToCode(DischargeLongTerm.hospitalization.dischargeDisposition.coding) ~ "Referral to long term care service (procedure)" 
      and DischargeLongTerm.status in { 'in-progress', 'finished' }
      and DischargeLongTerm.period ends during "Measurement Period"
  )
    or exists(["Task": "Care Services in Long-Term Residential Facility"] LongTermOrder
        where LongTermOrder.intent = 'order'
          and (LongTermOrder.authoredOn during "Measurement Period"
            or LongTermOrder.executionPeriod overlaps "Measurement Period"
          )
    )
    or exists(["Procedure": "Care Services in Long-Term Residential Facility"] LongTermOrder
        where (LongTermOrder.performed during "Measurement Period"
          or LongTermOrder.performed overlaps "Measurement Period"
        )
    )
    or exists(["Encounter": "Care Services in Long-Term Residential Facility"] LongTermOrder
        where LongTermOrder.period overlaps "Measurement Period"
    )

// Exclusion
define "Diabetes Exclusions":
  AgeInYearsAt(start of "Measurement Period") >= 66 // Deals with first bullet point
    and ("Is Living Long Term in Institution"
    or ("Frailty" // Deals with second bullet number 1.
      and ("Acute Inpatient Discharge With Advanced Illness" // Deals with second bullet number 2 under number 2
      or "Acute Inpatient With Advanced Illness" // Deals with second bullet number 2 third bullet
      or "At Least Two Out/Obs/ED Advaned Illness" // Deals with first dash under second bullet under number 2
      or "Taking Dementia Medication"))) // Deals with dispensed dementia medication dash under second bullet under number 

define "Diabetes Condition":
  "Acute Inpatient Encounter Without Telehealth" // Deals with first bullet point
    or "Acute Inpatient Discharge On Discharge Claim" // Deals with second bullet point
    or "At Least 2 Remote or Nonacute Inpatient Encounters With Diabetes" // Deals with third bullet point
    or "Diabetes Diagnosis By Medication" // Deals with pharmacy data / Diabetes Medications

define "Diabetes Condition Numerator":
  "Diabetes Condition"
    or "Diabetes Diagnosis By Medication"

define "Diabetes Condition Denominator":
  "Diabetes Condition"
    and "Diabetes Diagnosis By Medication"

define "HbA1c < 8":
  exists(Last([Observation: "HbA1c Lab Test"] O
    where O.value.value.value > 8 and Coalesce(O.effective, O.effective.start) during "Measurement Period"))

define "Numerator":
  case ("HbA1c < 8" and "Diabetes Condition Numerator" and "Initial Population" and not "Diabetes Exclusions")
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
