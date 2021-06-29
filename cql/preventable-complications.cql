library preventable_complications version '1'

using FHIR version '4.0.0'
include FHIRHelpers version '4.0.0' called FHIRHelpers

codesystem "SNOMED-CT": '2.16.840.1.113883.6.96' version '20200301'

// https://vsac.nlm.nih.gov/valueset/expansions?pr=all
// Start with VSAC but use the N. HEDIS Value Set Directory if it is not found or difficult to figure out.
// No promises JZ. https://cql.hl7.org/02-authorsguide.html
valueset "Care Services in Long-Term Residential Facility": '2.16.840.1.113883.3.464.1003.101.12.1014'
valueset "Diabetes Short Term Complications": '2.16.840.1.113883.3.464.1004.1366'
valueset "Diabetes Long Term Complications": '2.16.840.1.113883.3.464.1004.1365'
valueset "Uncontrolled Diabetes": '2.16.840.1.113883.3.464.1004.1377'
valueset "COPD": '2.16.840.1.113883.3.666.5.776'
valueset "Asthma": '2.16.840.1.113883.3.526.3.362'
valueset "Hypertension": '2.16.840.1.113883.3.3157.4022' // In dictionary: '2.16.840.1.113883.3.464.1004.1369'
valueset "Heart Failure": '2.16.840.1.113762.1.4.1106.82'
valueset "Lower Extremity Amputation Diagnosis": '2.16.840.1.113883.3.464.1003.113.11.1303' // In Dictionary '2.16.840.1.113883.3.464.1004.1154' 

// VSAC bacterial pneumonia with disorder 2.16.840.1.113883.6.96 Dictionary 2.16.840.1.113883.3.464.1004.1359
valueset "Bacterial pneumonia": '2.16.840.1.113883.3.464.1003.102.11.1043' 
valueset "Urinary tract infection": '2.16.840.1.113883.3.464.1004.1378' // Taken from dictionary. Too vast in VSAC.
valueset "Cellulitis": '2.16.840.1.113883.3.464.1004.1362' // Taken from dictionary. Too vast in VSAC.
valueset "Pressure ulcer": '2.16.840.1.113883.3.2066.2046' // Entire listing in VSAC uses 2.16.840.1.113883.6.96. In Dictionary 2.16.840.1.113883.3.464.1004.1372'
valueset "Sickle Cell Anemia and HB S Disease": '2.16.840.1.113883.3.464.1004.1373' // Taken from dictionary because of opioid definitions.
valueset "Immunocompromised State": '2.16.840.1.113883.3.666.5.1940'
valueset "Kidney and Urinary Tract Disorders": '2.16.840.1.113883.17.4077.3.2028'

valueset "Cystic Fibrosis": '2.16.840.1.113883.3.464.1003.102.12.1002'
valueset "Diabetes": '2.16.840.1.113883.3.464.1003.103.12.1001'
valueset "Traumatic Amputation of Lower Extremity": '2.16.840.1.113883.3.464.1004.1376' // Taken from dictionary.
valueset "Toe Amputation Diagnosis": '2.16.840.1.113883.3.464.1004.1375' // Taken from dictionary.
valueset "Acute Bronchitis" : '2.16.840.1.113883.3.464.1004.1016' // Taken from dictionary.
valueset "Cardiac Procedure": '2.16.840.1.113762.1.4.1029.55'
valueset "Stage I-IV Kidney Disease": '2.16.840.1.113883.3.464.1004.1374' // Taken from dictionary.
valueset "Dialysis": '2.16.840.1.113762.1.4.1222.161' // VASC: "Renal Disease Dialysis Procedure.

valueset "Inpatient Stay": '2.16.840.1.113762.1.4.1182.285'
valueset "Observation Stay": '2.16.840.1.113762.1.4.1181.72'
valueset "Nonacute Inpatient Stay": '2.16.840.1.113762.1.4.1182.289'
valueset "Patients Age 65 or Older in SNP or Long Term Care": '2.16.840.1.113762.1.4.1182.66'
// Medication codes would go here if they're added.

code "Patient transfer, to another health care facility (procedure)": '19712007' from "SNOMED-CT" display 'Patient transfer, to another health care facility (procedure)'
code "Referral to long term care service (procedure)": '417708006' from "SNOMED-CT" display 'Referral to long term care service (procedure)'
concept "Long Term Stay": {
  "Patient transfer, to another health care facility (procedure)",
  "Referral to long term care service (procedure)"
} display 'Long Term Stay'

parameter "Measurement Period" default Interval[@2020-01-01T00:00:00.0, @2020-12-31T23:59:59.999)
parameter "Prior Period" default Interval[@2019-01-01T00:00:00.0, @2019-12-31T23:59:59.999) // Not used yet because allowable gap not figured.

context Patient

define "Initial Population":
    AgeInYearsAt(end of "Measurement Period") >= 67 // and "Allowable gap")
        and not "Age Exclusions"

// define "Allowable gap":
    // CBT calculate differences in discharge dates, no more than one gap greater than 45 days.

define "Age Exclusions":
    exists([Encounter: "Patients Age 65 or Older in SNP or Long Term Care"] E where E.period during "Measurement Period")
    or exists([Encounter: "Is Living Long Term in Institution"])

// Event/diagnosis
define "Is Living Long Term in Institution":
  exists([Encounter: "Inpatient Stay"] DischargeLongTerm
    where FHIRHelpers.ToCode(DischargeLongTerm.hospitalization.dischargeDisposition.coding) ~ "Referral to long term care service (procedure)" 
      and DischargeLongTerm.status in { 'in-progress', 'finished' } // CBT
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

// Denominator steps:
// Step 1. Initial population.
define "General ACSC Population":
    ([Encounter: "Inpatient Stay"] 
        union [Encounter: "Observation Stay"] 
        except [Encounter: "Nonacute Inpatient Stay"]
    ) TotalStays
    where TotalStays.status in {'finished'}

// Step 2. Return the last encounter of the Chronic ASCS Population.
define "Direct Transfers": 
  Last(
    from
      "General ACSC Population" GAP,
      "General ACSC Population" GAP2
      where GAP.subject = GAP2.subject
          and (days between GAP.period.end and GAP2.period.start <= 1)
          and GAP2.period.end <= "December of 2020"
          )

// Step 3 for Chronic. Identify discharges by claim. CBT
define "Identify Chronic ASCS Discharges by Claim":
    ([Encounter: "Direct Transfers"] DT where exists(First([Condition:"Diabetes Short Term Complications"]))
        or exists(First([Condition: "Diabetes Long Term Complications"]))
        or exists(First([Condition: "Uncontrolled Diabetes"]))
        or (exists("Lower Extremity Amputation with Diabetes")
            and not exists("Traumatic Amputation of Lower Extremity Encounter") 
            and not exists("Toe Amputation Diagnosis Encounter"))
        or (exists(First([Condition: "COPD"])) 
          and not exists("Cystic Fibrosis Encounter")
        or (exists(First([Condition: "Asthma"])) 
          and not exists("Cystic Fibrosis Encounter"))
        or (exists("Acute Bronchitis with COPD") 
          and not exists("Cystic Fibrosis Encounter"))
        or (exists(First([Condition: "Heart Failure"])) 
          and not exists("Cardiac Procedure Encounter"))
        or (exists(First([Condition: "Hypertension"]))
          and not exists("Cardiac Procedure Encounter") 
          and not exists("Stage I-IV Kidney Disease Encounter with Dialysis"))
    )
  )

// Step 3 chronic auxiliary functions.
define "Lower Extremity Amputation with Diabetes":
  [Procedure: "Lower Extremity Amputation Diagnosis"] union [Condition: "Diabetes"]

define "Traumatic Amputation of Lower Extremity Encounter":
  [Encounter] E 
    with [Condition: "Traumatic Amputation of Lower Extremity"] C
      such that E.status in { 'finished' }

define "Toe Amputation Diagnosis Encounter":
  [Encounter] E 
    with [Condition: "Toe Amputation Diagnosis"] C
      such that E.status in { 'finished' }

define "Cystic Fibrosis Encounter":
  [Encounter] E 
    with [Condition: "Cystic Fibrosis"] C
      such that E.status in { 'finished' }

define "Acute Bronchitis with COPD":
  First("Acute Bronchitis") union "COPD"

define "Cardiac Procedure Encounter": 
  [Encounter] E 
    with [Condition: "Cardiac Procedure"] C
     such that E.status in { 'finished' }

define "Stage I-IV Kidney Disease Encounter":
  [Encounter] E 
    with [Condition: "Stage I-IV Kidney Disease"] C
      such that E.status in { 'finished' } 

define "Stage I-IV Kidney Disease Encounter with Dialysis":
  "Stage I-IV Kidney Disease Encounter" union [Condition: "Dialysis"]

// Step 3 for Acute. Identify discharges by claim. 
define "Identify Acute ASCS Discharges by Claim":
    ([Encounter: "Direct Transfers"] DT where (exists(First([Condition:"Bacterial pneumonia"])) 
          and not exists("Sickle Cell Anemia Encounter") 
          and not exists("Immunocompromised Encounter"))
        or (exists(First([Condition: "Urinary tract infection"]))
          and not exists("Kidney and Urinary Tract Disorders Encounter")
          and not exists("Immunocompromised Encounter"))
        or exists(First([Condition: "Cellulitis"]))
        or exists(First([Condition: "Pressure ulcer"]))
      )

// Step 3 acute auxiliary functions.
define "Sickle Cell Anemia Encounter":
  [Encounter] E 
    with [Condition: "Sickle Cell Anemia and HB S Disease"] C
      such that E.status in { 'finished' } 

define "Kidney and Urinary Tract Disorders Encounter":
  [Encounter] E 
    with [Condition: "Kidney and Urinary Tract Disorders"] C
      such that E.status in { 'finished' }

define "Immunocompromised Encounter":
  [Encounter] E 
    with [Condition: "Immunocompromised Condition and Procedure"] C
      such that E.status in { 'finished' }

define "Immunocompromised Condition and Procedure":
  [Condition: "Immunocompromised State"] union [Procedure: "Immunocompromised State"]

// Step 4 Chronic.
define "Chronic ASCS Outliers":
  Count("Identify Chronic ASCS Discharges by Claim") >= 3

define "Chronic ASCS Nonoutliers":
  Count("Identify Chronic ASCS Discharges by Claim") < 3

// Step 4 Acute.
define "Acute ASCS Outliers":
  Count("Identify Acute ASCS Discharges by Claim") >= 3

define "Acute ASCS Nonoutliers":
  Count("Identify Acute ASCS Discharges by Claim") < 3

define "December of 2020":
  Date(2020, 12, 01)

// define "Numerator":

// define "Denominator":

// define "Denominator Count":
//  Sum("Denominator")

// define "Numerator Count":
//  Sum("Numerator")

// define "CDC Measure Score":
//   Sum("Numerator") / Sum("Denominator")