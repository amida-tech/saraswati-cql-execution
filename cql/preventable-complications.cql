library preventable_complications version '1'

using FHIR version '4.0.0'
include FHIRHelpers version '4.0.0' called FHIRHelpers

codesystem "SNOMED-CT": '2.16.840.1.113883.6.96' version '20200301'

// https://vsac.nlm.nih.gov/valueset/expansions?pr=all
valueset "Care Services in Long-Term Residential Facility": '2.16.840.1.113883.3.464.1003.101.12.1014'
valueset "Diabetes Short Term Complications": '2.16.840.1.113883.3.464.1004.1366' // Taken from dictionary
// Short Term ICD10CM Version 2019-10-01 Code E10.10 | E10.11 | E10.641 | E11.00 | E11.01 | E11.641
valueset "Diabetes Long Term Complications": '2.16.840.1.113883.3.464.1004.1365' // Taken from dictionary
// Long Term ICD10CM Version 2019-10-01 Codes 
// E10.21 | E10.22 | E10.29 | E10.311 | E10.319 | E10.321 | E10.3211 | E10.3212 | E10.3213 | E10.3219 |
// E10.329 | E10.3291 | E10.3292 | E10.3293 | E10.3299 | E10.331 | E10.3311 | E10.3312 | E10.3313 | E10.3319 |
// E10.339 | E10.3391 | E10.3392 | E10.3393 | E10.3399 | E10.341 | E10.3411 | E10.3412 | E10.3413 | E10.3419 | 
// E10.349 | E10.3491 | E10.3492 | E10.3493 | E10.3499 | E10.351 | E10.3511 | E10.3512 | E10.3513 | E10.3519 | 
// E10.3521 | E10.3522 | E10.3523 | E10.3529 | E10.3531 | E10.3532 | E10.3533 | E10.3539 | E10.3541 | E10.3542 |
// E10.3543 | E10.3549 | E10.3551 | E10.3552 | E10.3553 | E10.3559 | E10.359 | E10.3591 | E10.3592 | E10.3593 |
// E10.3599 | E10.36 | E10.37X1 | E10.37X2 | E10.37X3 | E10.37X9 | E10.39 | E10.40 | E10.41 | E10.42 | E10.43 | E10.44 | E10.49 |
// E10.51 | E10.52 | E10.59 | E10.610 | E10.618 | E10.620 | E10.621 | E10.622 | E10.628 | E10.630 | E10.638 | E10.69 |
// E10.8 | E11.21 | E11.22 | E11.29 | E11.311 | E11.319 | E11.321 | E11.3211 | E11.3212 | E11.3213 | E11.3219 |
// E11.329 | E11.3291 | E11.3292 | E11.3293 | E11.3299 | E11.331 | E11.3311 | E11.3312 | E11.3313 | E11.3319 |
// E11.339 | E11.3391 | E11.3392 | E11.3393 | E11.3399 | E11.341 | E11.3411 | E11.3412 | E11.3413 | E11.3419 | 
// E11.349 | E11.3491 | E11.3492 | E11.3493 | E11.3499 | E11.351 | E11.3511 | E11.3512 | E11.3513 | E11.3519 | 
// E11.3521 | E11.3522 | E11.3523 | E11.3529 | E11.3531 | E11.3532 | E11.3533 | E11.3539 | E11.3541 | E11.3542 |
// E11.3543 | E11.3549 | E11.3551 | E11.3552 | E11.3553 | E11.3559 | E11.359 | E11.3591 | E11.3592 | E11.3593 |
// E11.3599 | E11.36 | E11.37X1 | E11.37X2 | E11.37X3 | E11.37X9 | E11.39 | E11.40 | E11.41 | E11.42 | E11.43 | E11.44 | E11.49 |
// E11.51 | E11.52 | E11.59 | E11.610 | E11.618 | E11.620 | E11.621 | E11.622 | E11.628 | E11.630 | E11.638 | E11.69 | E11.8 | 

valueset "Uncontrolled Diabetes": '2.16.840.1.113883.3.464.1004.1377' // Taken from dictionary
// Uncontrolled ICD10CM Version 2019-10-01 Code E10.649 | E10.65 | E11.649 | E11.65
valueset "COPD": '2.16.840.1.113883.3.666.5.776' 
valueset "Asthma": '2.16.840.1.113883.3.526.3.362'
valueset "Hypertension": '2.16.840.1.113883.3.3157.4022' 
valueset "Heart Failure": '2.16.840.1.113762.1.4.1106.82'
valueset "Lower Extremity Amputation Diagnosis": '2.16.840.1.113883.3.464.1003.113.11.1303' 

valueset "Bacterial pneumonia": '2.16.840.1.113883.3.464.1003.102.11.1043'  // From dictionary.
// Bacterial pneumonia SNOMEDCT version 2021-03 Codes: 420544002 | 53084003 | 713544008
valueset "Urinary tract infection": '2.16.840.1.113883.17.4077.3.2054' // From dictionary.
// UTI SNOMEDCT version 2021-03 Codes: 10812041000119103	| 199111004	| 307534009	| 368991000119100	| 369001000119100	| 369011000119102	| 68566005	| 700372006	| 96171000119103 
// UTI ICD10CM version 2021 Code: N39.0	| O03.38 | O03.88 | O04.88 | O07.38 | O86.20

// Cellulitis family. Because these conditions aren't grouped, they have to be sought individually.
valueset "Cellulitis (ICD10CM)": '2.16.840.1.113762.1.4.1146.717' // Only using this for now.
valueset "Cellulitis (SNOMED)": '2.16.840.1.113762.1.4.1146.718'
valueset "Cellulitis Of Orbit": '2.16.840.1.113883.3.3157.1003.129'

valueset "Pressure ulcer": '2.16.840.1.113883.3.2066.2046' 
valueset "Sickle Cell Anemia and HB S Disease": '2.16.840.1.113762.1.4.1029.35'
valueset "Immunocompromised State": '2.16.840.1.113883.3.666.5.1940'
valueset "Kidney and Urinary Tract Disorders": '2.16.840.1.113883.17.4077.3.2028'

valueset "Cystic Fibrosis": '2.16.840.1.113883.3.464.1003.102.12.1002'
valueset "Diabetes": '2.16.840.1.113883.3.464.1003.103.12.1001'
valueset "Traumatic Amputation of Lower Extremity": '2.16.840.1.113883.3.464.1004.1376' // Taken from dictionary.
// Traumatic Amputation of Lower Extremity ICD10CM version 2019-10-01 S78.011A | S78.012A | S78.019A | S78.021A | S78.022A | S78.029A | S78.111A | S78.112A | 
// S78.122A | S78.129A | S78.911A | S78.912A | S78.919A | S78.921A | S78.922A | S78.929A | S88.011A | S88.012A | S88.019A | S88.021A |  S88.022A | S88.029A |
// S88.111A | S88.112A | S88.119A | S88.121A | S88.122A | S88.129A | S88.911A | S88.912A | S88.919A | S88.921A | S88.922A | S88.929A |
// S98.011A | S98.012A | S98.019A | S98.021A | S98.022A | S98.029A | S98.111A | S98.112A | S98.119A | S98.121A | S98.122A | S98.129A |
// S98.131A | S98.132A | S98.139A | S98.141A | S98.142A | S98.149A | S98.211A | S98.212A | S98.219A | S98.221A | S98.222A | S98.229A |
// S98.311A | S98.312A | S98.319A | S98.321A | S98.322A | S98.329A | S98.911A | S98.912A | S98.919A | S98.921A | S98.922A | S98.929A |
valueset "Toe Amputation Diagnosis": '2.16.840.1.113883.3.464.1004.1375' // Taken from dictionary.
// Toe Amputation ICD10PCS Version 2019-10-01
// 0Y6P0Z0 | 0Y6P0Z1 | 0Y6P0Z2 | 0Y6P0Z3 | 0Y6Q0Z0 | 0Y6Q0Z1 | 0Y6Q0Z2 | 0Y6Q0Z3 | 0Y6R0Z0 | 0Y6R0Z1 | 0Y6R0Z2 | 0Y6R0Z3 | 
// 0Y6S0Z0 | 0Y6S0Z1 | 0Y6S0Z2 | 0Y6S0Z3 | 0Y6T0Z0 | 0Y6T0Z1 | 0Y6T0Z2 | 0Y6T0Z3 | 0Y6U0Z0 | 0Y6U0Z1 | 0Y6U0Z2 | 0Y6U0Z3 | 
// 0Y6V0Z0 | 0Y6V0Z1 | 0Y6V0Z2 | 0Y6V0Z3 | 0Y6W0Z0 | 0Y6W0Z1 | 0Y6W0Z2 | 0Y6W0Z3 | 0Y6X0Z0 | 0Y6X0Z1 | 0Y6X0Z2 | 0Y6X0Z3 | 
// 0Y6Y0Z0 | 0Y6Y0Z1 | 0Y6Y0Z2 | 0Y6Y0Z3 | 
valueset "Acute Bronchitis" : '2.16.840.1.113883.3.88.12.3221.7.4' 
// Acute Bronchitis SNOMEDCT version 2021-03 10509002 | 138389411000119105 | 195728004 | 196020005 | 5875001 |	714203003 | 785745000 | 80257001
valueset "Cardiac Procedure": '2.16.840.1.113762.1.4.1029.55'
valueset "Stage I-IV Kidney Disease": '2.16.840.1.113883.3.464.1004.1374' // Taken from dictionary.
// Stage I-IV Kidney Disease ICDM10CM version 2019-10-01 Code I13.10 | I12.9
valueset "Dialysis": '2.16.840.1.113762.1.4.1222.161' 

valueset "Inpatient Stay": '2.16.840.1.113762.1.4.1182.285'
valueset "Observation Stay": '2.16.840.1.113762.1.4.1181.72'
valueset "Nonacute Inpatient Stay": '2.16.840.1.113762.1.4.1182.289'
valueset "Encounter Inpatient": '2.16.840.1.113883.3.666.5.307'
valueset "Patients Age 65 or Older in SNP or Long Term Care": '2.16.840.1.113762.1.4.1182.66'

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
    or exists("Is Living Long Term in Institution")

// Event/diagnosis
define "Is Living Long Term in Institution":
  exists([Encounter: "Encounter Inpatient"] DischargeLongTerm
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

// Step 2: Not currently working. Just returning GAP instead. 
define "Direct Transfers":
  from 
    "General ACSC Population" GAP
    // "General ACSC Population" GAP2
    // where GAP.subject = GAP2.subject
          // and GAP.id != GAP2.id
          // and (GAP.period.end before GAP.period.start)
          // and (days between GAP.period.end and GAP2.period.start <=1)
          // and duration in days between GAP.period.end and GAP2.period.start <= 1
          // and GAP2.period.start > GAP.period.start
          // and GAP2.period.end <= "Measurement Year End"
          // and GAP2.period.end <= Date(2013, 12, 01)
    return GAP

// define function "Direct Transfers Exclusions"(enc Encounter):

// Step 3 for Chronic. Identify discharges by claim. CBT
define "Identify Chronic ACSC Discharges by Claim":
    ("Direct Transfers" DT where exists(First([Condition:"Diabetes Short Term Complications"]))
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
define "Identify Acute ACSC Discharges by Claim":
    ("Direct Transfers" DT where (exists(First([Condition:"Bacterial pneumonia"])) 
          and not exists("Sickle Cell Anemia Encounter") 
          and not exists("Immunocompromised Encounter"))
        or (exists(First([Condition: "Urinary tract infection"]))
          and not exists("Kidney and Urinary Tract Disorders Encounter")
          and not exists("Immunocompromised Encounter"))
        or exists(First([Condition: "Cellulitis (ICD10CM)"]))
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
    with "Immunocompromised Condition and Procedure" C
      such that E.status in { 'finished' }

define "Immunocompromised Condition and Procedure":
  [Condition: "Immunocompromised State"] union [Procedure: "Immunocompromised State"]

// Step 4 Chronic.
define "Chronic ACSC Outliers":
  "Chronic ACSC Count" >= 3

define "Chronic ACSC Nonoutliers":
  "Chronic ACSC Count" < 3

define "Chronic ACSC Count":
  Count("Identify Chronic ACSC Discharges by Claim")

// Step 4 Acute.
define "Acute ACSC Outliers":
  "Acute ACSC Count" >= 3

define "Acute ACSC Nonoutliers":
  "Acute ACSC Count" < 3

define "Acute ACSC Count":
  Count("Identify Acute ACSC Discharges by Claim")

define "Total ACSC Outliers":
  case
    when "Acute ACSC Outliers" = false and "Chronic ACSC Outliers" = false then 0
    when "Acute ACSC Outliers" = false and "Chronic ACSC Outliers" = true then 1
    when "Acute ACSC Outliers" = true and "Chronic ACSC Outliers" = false then 1
    else 2
  end

define "Measurement Year End":
  Date(2020, 12, 01)

