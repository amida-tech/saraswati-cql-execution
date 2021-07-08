library readmission version '1'

using FHIR version '4.0.0'
include FHIRHelpers version '4.0.0' called FHIRHelpers

codesystem "SNOMEDCT": 'urn:oid:2.16.840.1.113883.6.96' version 'urn:hl7:version:2017-09'
codesystem "LOINC": 'http://loinc.org'

valueset "Inpatient Stay": '2.16.840.1.113762.1.4.1182.285'
valueset "Nonacute Inpatient Stay": '2.16.840.1.113762.1.4.1182.289'
valueset "Observation Encounter": '2.16.840.1.113762.1.4.1181.72'

code "Patient deceased during stay": '371828006' from "SNOMEDCT" display 'Patient deceased during stay'
code "Pregnancy": '305386002' from "SNOMEDCT" display 'Pregnancy'

parameter "Measurement Period" default Interval[@2020-01-01T00:00:00.0, @2020-12-01T00:00:00.0)

context Patient

//Denominator
//Step 1
define "All Inpatient Discharge List":
  [Encounter: "Inpatient Stay"] Enc
    where Enc.status = 'finished'
    and Enc.period starts during "Measurement Period"

define "Nonacute Inpatient Discharge List":
  [Encounter: "Nonacute Inpatient Stay"] E
    where E.status ~ 'finished'
    and E.period starts during "Measurement Period"

define "Observation Visit List":
  [Encounter: "Observation Encounter"] E
    where E.status ~'finished'
    and E.period starts during "Measurement Period"

define "Acute Discharge List":
  ("All Inpatient Discharge List" except "Nonacute Inpatient Discharge List")
    union "Observation Visit List"

define "All Discharge List":
  "All Inpatient Discharge List" union "Observation Visit List"

//Step 2
define "Direct Transfers":
  Last(
    from
      "Acute Discharge List" GAP,
      "Acute Discharge List" GAP2
      where GAP.subject = GAP2.subject
          and (days between GAP.period.end and GAP2.period.start <= 1)
  )

//Step 3
define "Multi-Day Visits":
  "Acute Discharge List" ADL
    where (days between ADL.period.end and ADL.period.start > 1)

//Step 4
define "No Death":
  "Multi-Day Visits" MDV
    where MDV.hospitalization.dischargeDisposition !~ "Patient deceased during stay"

define "No Pregnancy":
  "No Death" ND
    where ND.hospitalization.dischargeDisposition !~ "Pregnancy"

// TODO remove perinatal encounters

// Step 5 continuous enrollment
define "Continuous Enrollment":
  from
    "No Pregnancy" NP,
    "All Discharge List" ALL
      where (ALL.period.end occurs 365 days or less before NP.period.end)
        or (ALL.period.end occurs 30 days or less after NP.period.end)

// Step 6 Remove hospital stays for outlier members
define "Remove Outliers":
  case Count("Continuous Enrollment") > 4
    when true then "Continuous Enrollment"
    else {}
  end

// Step 7
