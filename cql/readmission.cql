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
  [Encounter: "Inpatient Stay"] Enc
    where Enc.status = 'finished'
    and Enc.period starts during "Denominator Measurement Period"

define "Nonacute Inpatient Discharge List":
  [Encounter: "Nonacute Inpatient Stay"] E
    where E.status ~ 'finished'
    and E.period starts during "Denominator Measurement Period"

define "Observation Visit List":
  [Encounter: "Observation Encounter"] E
    where E.status ~'finished'
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
    where GAP.subject = GAP2.subject
       and (days between GAP.period.end and GAP2.period.start <= 1)
       and GAP2.period.end <= "December of 2020"
  return GAP2

define "Final Den Direct Transfer":
  Last("All Den Direct Transfers")

define "Den Direct Transfers":
    "Num Acute Discharge List" except "All Den Direct Transfers" union {"Final Den Direct Transfer"}

//Step 3
define "Multi-Day Visits":
  "Den Direct Transfers" DT
    where (days between DT.period.end and DT.period.start > 1)

//Step 4
define "No Death or Pregnancy":
  "Multi-Day Visits" MDV
    where MDV.hospitalization.dischargeDisposition !~ "Patient deceased during stay"
      and not contains(MDV.reasonCode.coding, "Pregnancy")
        and not contains(MDV.reasonCode.coding, "Perinatal")

// Step 5 continuous enrollment
define "Continuous Enrollment":
  from
    "No Death or Pregnancy" NDOP,
    "All Discharge List" ALL
      where (ALL.period.end occurs 365 days or less before NDOP.period.end)
        or (ALL.period.end occurs 30 days or less after NDOP.period.end)
  return ALL

// Step 6 Remove hospital stays for outlier members
define "Remove Outliers":
  case Count("Continuous Enrollment") > 4
    when true then "Continuous Enrollment"
    else {}
  end

// Step 7

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
    "Num No Pregnancy" NNP,
    "Continuous Enrollment" CE
      where days between CE.period.end and NNP.period.start <=30)
