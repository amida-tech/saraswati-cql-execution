/*
Colorectal Cancer Screening (COL)
*/

library col-cancer-screening version '1.0.1'
using FHIR version '4.0.0'
include FHIRHelpers version '4.0.0' called FHIRHelpers

/*
Description
The percentage of members 50-75 years of age who had appropriate screening for colorectal cancer.
*/

/*
It is an outstanding question whether implementers would have an easier time dealing
with single code system value sets for retrieval of data, or if the grouping value sets
are easier to deal with. This mesaure is modified to take the approach of unioning
the results in CQL, where the BCS and CCS measures take the grouping value set
approach.
*/
codesystem "RXNORM": 'RXNORM'
codesystem "LOINC": 'http://loinc.org'
codesystem "SNOMED": 'http://snomed.info/sct'
codesystem "CQFramework": 'http://cqframework.info/codesystem/placeholder'

/* Taken from the M. HEDIS MY 2022 Volume 2 Value Set Directory 2021-08-02 */
//valueset "Palliative Care Assessment": 'xxxxxxxxxxxxxxxxx'
//valueset "Palliative Care Encounter": 'xxxxxxxxxxxxxxxxx'
//valueset "Palliative Care Intervention": 'xxxxxxxxxxxxxxxxx'
valueset "Frailty Device": '2.16.840.1.113883.3.464.1003.118.12.1300'
valueset "Frailty Diagnosis": '2.16.840.1.113883.3.464.1003.113.12.1074'
valueset "Frailty Encounter": '2.16.840.1.113883.3.464.1003.101.12.1088'
valueset "Frailty Symptom": '2.16.840.1.113883.3.464.1003.113.12.1075'
valueset "Outpatient": '2.16.840.1.113883.3.464.1003.101.12.1008'
valueset "Observation": '2.16.840.1.113762.1.4.1181.72'
valueset "ED": '2.16.840.1.113762.1.4.1104.9'
valueset "Telephone Visits": '2.16.840.1.113883.3.1444.5.216'
valueset "Online Assessments": '2.16.840.1.113883.3.464.1003.101.12.1089'
valueset "Nonacute Inpatient": '2.16.840.1.113883.3.464.1003.101.12.1084'
valueset "Advanced Illness": '2.16.840.1.113883.3.464.1003.110.12.1082'
valueset "Inpatient Stay": '2.16.840.1.113762.1.4.1182.285'
valueset "Nonacute Inpatient Stay": '2.16.840.1.113762.1.4.1182.289'
valueset "Acute Inpatient": '2.16.840.1.113762.1.4.1182.120'
valueset "Dementia Medications List": '2.16.840.1.113883.3.464.1003.196.11.1517'
valueset "FOBT Lab Test": '2.16.840.1.113883.3.464.1003.198.12.1011'
valueset "FOB Test Result or Finding": '2.16.840.1.113883.3.464.1003.198.11.1020'
valueset "Flexible Sigmoidoscopy": '2.16.840.1.113883.3.464.1003.198.12.1010'
//valueset "History of Flexible Sigmoidoscopy": 'xxxxxxxxxxxxxxxxx'
valueset "Colonoscopy": '2.16.840.1.113883.3.464.1003.108.12.1020'
//valueset "History of Colonoscopy": 'xxxxxxxxxxxxxxxxx'

valueset "CT Colonoscopy": '2.16.840.1.113883.3.464.1003.108.12.1038'

valueset "FIT DNA Lab Test": '2.16.840.1.113883.3.464.1003.108.12.1039'
/* Observation??? */

valueset "Colorectal Cancer": '2.16.840.1.113762.1.4.1116.256'
//valueset "Total Colectomy": 'xxxxxxxxxxxxxxxxx'
//valueset "History of Total Colectomy": 'xxxxxxxxxxxxxxxxx'

code "Total Colectomy": '26390003' from "SNOMED-CT" display 'Total Colectomy (procedure)'


/*
This library has an explicit parameter which is the product line.
Recognized normal arguments are {'commercial', 'medicaid', 'medicare'}.
If one of these normal arguments is given, the patient will only be
considered to be in the Initial Population if they have an appropriate
continuous enrollment in that kind of medical plan.
If instead a null argument is given, their enrollment status will have no
effect on whether they are considered to be in the Initial Population.
If instead some other argument is given (an unrecognized plan type),
the patient will unconditionally NOT be in the Initial Population.
*/

parameter "Product Line" String

/*
This library has an explicit parameter which is the measurement year.
While the actual parameter's type accepts all intervals, this library
expects it will only be given arguments corresponding exactly to one whole
calendar year, and it will not behave properly otherwise; 2017 for example:
Interval[DateTime(2017,1,1,0,0,0,0), DateTime(2018,1,1,0,0,0,0))
*/

parameter "Measurement Period" default Interval[@2021-01-01, @2021-12-31]

define "Lookback Interval Two More Years":
  Interval[start of "Measurement Period" - 2 years, end of "Measurement Period")

define "Lookback Interval Four More Years":
  Interval[start of "Measurement Period" - 4 years, end of "Measurement Period")

define "Lookback Interval Nine More Years":
  Interval[start of "Measurement Period" - 9 years, end of "Measurement Period")


/*
  Definitions based on Effectiveness of Care Prevention and Screening document
  for Colorectal Cancer Screening -- Summary of Changes to MEDIS MY 2022
*/

/*
  TODO: create procedures to exclude the items listed in the exclusions
  go ahead and hard-code the specified exclusions [note this in the comments]
  eventually we want to include a global param for these sorts of exclusions
*/

context Patient

//define "Required Exclusions":
  /* Members in Hospice */
  /* Members receiving Palliative Care during the Measurement Year */

define "Frailty Exclusion Encounters":
  [Encounter: "Frailty Device"] 
    union [Encounter: "Frailty Diagnosis"]
    union [Encounter: "Frailty Encounter"]
    union [Encounter: "Fraility Symptom"]

define "Frailty Exclusion Claims":
  [Claim: "Frailty Device"] 
    union [Claim: "Frailty Diagnosis"]
    union [Claim: "Frailty Encounter"]
    union [Claim: "Fraility Symptom"]

//define "Exclusions":

define "Valid Ages":
	AgeInYearsAt(end of "Measurement Period") > 50 and AgeInYearsAt(end of "Measurement Period") <= 75

define "66 Years or Older":
  AgeInYearsAt(end of "Measurement Period") >= 66
