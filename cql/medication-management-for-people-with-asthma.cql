library medication_management_for_people_with_asthma version '1'

using FHIR version '4.0.0'
include FHIRHelpers version '4.0.0' called FHIRHelpers

codesystem "SNOMED-CT": '2.16.840.1.113883.6.96' version '20200301'

// TODO: All of the uncommented valueset lines below are using
// a URN from VSAC, but once we get programmatic access to the HEDIS excel files
// we'll need to change these
valueset "Asthma": '2.16.840.1.113883.3.526.3.362'
valueset "Acute Inpatient": '2.16.840.1.113762.1.4.1182.120'
valueset "Acute Respiratory Failure": '2.16.840.1.113883.3.464.1003.102.12.1018'
//valueset "Chronic Respiratory Conditions Due to Fumes or Vapors": [GET FROM HEDIS BOOK]
valueset "Cystic Fibrosis": '2.16.840.1.113883.3.464.1003.102.12.1002'
valueset "COPD": '2.16.840.1.113883.3.666.5.776'
valueset "ED": '2.16.840.1.113883.3.464.1003.101.12.1085'
valueset "Emphysema": '2.16.840.1.113883.3.464.1003.102.12.1004'
valueset "Inpatient Stay": '2.16.840.1.113762.1.4.1182.285'
valueset "Nonacute Inpatient Stay": '2.16.840.1.113762.1.4.1182.289'
valueset "Observation Encounter": '2.16.840.1.113762.1.4.1181.72'
valueset "Obstructive Chronic Bronchitus": '2.16.840.1.113883.3.464.1003.102.12.1024'
valueset "Online Assessments": '2.16.840.1.113883.3.7587.3.1013'
//valueset "Other Emphysema": [GET FROM HEDIS BOOK]
valueset "Outpatient": '2.16.840.1.113883.3.464.1003.101.12.1008'
valueset "Preferred Asthma Therapy": '2.16.840.1.113883.3.464.1003.196.12.1212'
valueset "Telehealth Modifier": '2.16.840.1.113762.1.4.1138.731'
valueset "Telehealth POS": '2.16.840.1.113883.3.464.1003.101.11.1155'
valueset "Telephone Visits": '2.16.840.1.113883.3.1444.5.216'

code "Albuterol": '372897005' from "SNOMED-CT" display 'Albuterol'
code "Levalbuterol": '116090007' from "SNOMED-CT" display 'Levalbuterol'
code "Dyphylline-guaifenesin": '398742006' from "SNOMED-CT" display 'Dyphylline-guaifenesin'
// The SNOWMED CT Browser tool shows that albuterol and Montelukast have the same code, 
// which is strange given they are in different categories in the spec
code "Montelukast": '372897005' from "SNOMED-CT" display 'Montelukast'
code "Zafirlukast": '386880006' from "SNOMED-CT" display 'Zafirlukast'
code "Zileuton": '108617005' from "SNOMED-CT" display 'Zileuton'

// TODO: there are more asthma medications needed than are listed here
// See Missing Medication Codes section in README for details
concept "Asthma Medication": {
  "Albuterol",
  "Levalbuterol",
  "Dyphylline-guaifenesin"
} display 'Asthma Medication'

concept "Leukotriene Based Medication": {
  "Montelukast",
  "Zafirlukast",
  "Zileuton"
} display 'Leukotriene Based Medication'

parameter "Measurement Period" default Interval[@2020-01-01T00:00:00.0, @2020-12-31T23:59:59.999)
parameter "Prior Period" default Interval[@2019-01-01T00:00:00.0, @2019-12-31T23:59:59.999)

context Patient

define "Initial Population":
	AgeInYearsAt(end of "Measurement Period") >= 5
    and AgeInYearsAt(end of "Measurement Period") < 64

define "Emergency Department Visit":
  [Encounter: "ED"] E0
    with [Condition: "Asthma"] C
      such that exists(C)

define "Acute Inpatient Encounter Without Telehealth":
  [Encounter: "Acute Inpatient"] E0
    without [Encounter: "Telehealth Modifier"] E1
      such that exists(E1)
    without [Encounter: "Telehealth POS"] E2
      such that exists(E2)
    with [Condition: "Asthma"] C
      such that exists(C)

define "Acute Inpatient Discharge":
  [Encounter: "Acute Inpatient"] E
    with [Condition: "Asthma"] C
      such that exists(C)
    where E.status = 'finished'

define function EncounterWithAsthma(Enc List<Encounter>):
  Enc E
    with [Condition: "Asthma"] C
      such that exists(E)

define "Outpatient Visit":
  EncounterWithAsthma([Encounter: "Outpatient"])

define "Observation Visit":
  EncounterWithAsthma([Encounter: "Observation Encounter"])

define "Telehealth POS Visit":
  EncounterWithAsthma([Encounter: "Telehealth POS"])

define "Telehealth Modifier Visit":
  EncounterWithAsthma([Encounter: "Telehealth Modifier"])

define "Telephone Visit":
  EncounterWithAsthma([Encounter: "Telephone Visits"])

define "Online Assessment":
  EncounterWithAsthma([Encounter: "Online Assessments"])

define "Tele Visits Filtered Dates":
    ("Telephone Visit" union
    "Telehealth Modifier Visit" union
    "Online Assessment" union
    "Telehealth POS Visit") TeleVisits
    return ToDate(TeleVisits.period.start)

define "Other Visits Filtered Dates":
  ("Outpatient Visit" union "Observation Visit") OtherVisits
  return ToDate(OtherVisits.period.start)

define "Tele Visit Count in Measurement Period":
  Count("Tele Visits Filtered Dates" D where D in "Measurement Period")

define "Other Visits Count in Measurement Period":
  Count("Other Visits Filtered Dates" D where D in "Measurement Period")

define "Tele Visit Count Prior Period":
  Count("Tele Visits Filtered Dates" D where D in "Prior Period")

define "Other Visit Count Prior Period":
  Count("Other Visits Filtered Dates" D where D in "Prior Period")

// Converting the coding to a code makes the list a singleton (takes the first value from list)
// but I think in theory you wouldn't ever have more than one medication code in the coding
// but not 100% sure about that
define function MedicationInPeriod(MedType Concept, Int Interval<DateTime>):
  [MedicationDispense] M
    where FHIRHelpers.ToCode(M.medication.coding) ~ MedType
    and M.whenHandedOver during Int

define "Non-Leukotriene Medication Measurement Period":
  Count(MedicationInPeriod("Asthma Medication", "Measurement Period"))

define "Leukotriene Medication Measurement Period":
  Count(MedicationInPeriod("Leukotriene Based Medication", "Measurement Period"))

define "Non-Leukotriene Medication Prior Period":
  Count(MedicationInPeriod("Asthma Medication", "Prior Period"))

define "Leukotriene Medication Prior Period":
  Count(MedicationInPeriod("Leukotriene Based Medication", "Prior Period"))

define "Asthma Condition Measurement Period":
  exists([Condition: "Asthma"] C
    where C.onset.value during "Measurement Period")

define "Asthma Condition Prior Period":
  exists([Condition: "Asthma"] C
    where C.onset.value during "Prior Period")

define "Asthma By Medication Measurement Period":
  case
    when "Non-Leukotriene Medication Measurement Period" = 0 and "Leukotriene Medication Measurement Period" >= 4 and "Asthma Condition Measurement Period" then true
    when "Non-Leukotriene Medication Measurement Period" != 0 and "Non-Leukotriene Medication Measurement Period" + "Leukotriene Medication Measurement Period" >= 4 then true
    else false
  end

define "Asthma By Medication Prior Period":
  case
    when "Non-Leukotriene Medication Prior Period" = 0 and "Leukotriene Medication Prior Period" >= 4 and "Asthma Condition Prior Period" then true
    when "Non-Leukotriene Medication Prior Period" != 0 and "Non-Leukotriene Medication Prior Period" + "Leukotriene Medication Prior Period" >= 4 then true
    else false
  end

define "Valid Encounters":
  "Emergency Department Visit"
  union "Acute Inpatient Encounter Without Telehealth"
  union "Acute Inpatient Discharge"

define "Exclusion Diagnoses":
  [Condition: "Emphysema"]
  // union [Condition: "Other Emphysema"] // found in HEDIS book only
  union [Condition: "COPD"]
  union [Condition: "Obstructive Chronic Bronchitus"]
  // union [Condition: "Chronic Respiratory Conditions Due to Fumes or Vapors" // found in HEDIS book only
  union [Condition: "Cystic Fibrosis"]
  union [Condition: "Acute Respiratory Failure"]

define function AtLeastFourVisitsInPeriod(TeleVisits Integer, OtherVisits Integer):
  case TeleVisits >= 3
    when true then 3 + OtherVisits >= 4
    else TeleVisits + OtherVisits >= 4
  end

define "Measurement Period Qualifiers":
  exists("Valid Encounters" E where E.period.start in "Measurement Period")
  or AtLeastFourVisitsInPeriod("Tele Visit Count in Measurement Period", "Other Visits Count in Measurement Period")
  or "Asthma By Medication Measurement Period"

define "Prior Period Qualifiers":
  exists("Valid Encounters" E where E.period.start in "Prior Period")
  or AtLeastFourVisitsInPeriod("Tele Visit Count Prior Period", "Other Visit Count Prior Period")
  or "Asthma By Medication Prior Period"

define "Exclusions":
  exists("Exclusion Diagnoses" C where C.onset before DateTime(2020, 12, 31, 59, 59, 9))
  or "Non-Leukotriene Medication Measurement Period" + "Leukotriene Medication Measurement Period" = 0

define "Denominator":
  case (
    "Initial Population"
    and "Measurement Period Qualifiers"
    and "Prior Period Qualifiers"
    and not "Exclusions"
    )
    when true then 1
    else 0
  end

define "Active Diagnoses During Measurement Period":
  "Exclusion Diagnoses" D where Interval[D.onset, D.abatement] overlaps "Measurement Period"

define "Index Prescription Start Date":
  First(
    [MedicationDispense] MD
      where MD.whenHandedOver.value in "Measurement Period"
      sort by whenHandedOver.value asc).whenHandedOver

define "End of 2020":
  Date(2020, 12, 31)

define "Start of 2020":
  Date(2020, 01, 01)

define "IPSD Number":
  days between "Start of 2020" and "Index Prescription Start Date"

define "Treatment Period Number":
  days between "Index Prescription Start Date" and "End of 2020" 

define function CumulativeDuration(Intervals List<Interval<Integer>>):
  Sum((collapse Intervals) X return end of X - start of X)

define "Medication in Date Range":
  [MedicationDispense] E
    where E.whenHandedOver in "Measurement Period"
    return Interval[
      days between "Start of 2020" and E.whenHandedOver, 
      if (days between "Start of 2020" and E.whenHandedOver) + ToInteger(ToString(E.daysSupply.value.value)) > 365 then 365 else (days between "Start of 2020" and E.whenHandedOver) + ToInteger(ToString(E.daysSupply.value.value))
    ]

define "Days Covered":
  CumulativeDuration("Medication in Date Range")

define "Proportion of Days Covered":
  "Days Covered" / "Treatment Period Number"

define "Numerator Medication Compliance 50%":
  case ("Proportion of Days Covered" >= 0.50)
    when true then 1
    else 0
  end

define "Numerator Medication Compliance 75%":
  case ("Proportion of Days Covered" >= 0.75)
    when true then 1
    else 0
  end

define "Stratification 1":
  AgeInYearsAt(start of "Measurement Period") >= 5
    and AgeInYearsAt(start of "Measurement Period") < 11

define "Stratification 2":
  AgeInYearsAt(start of "Measurement Period") >= 11
    and AgeInYearsAt(start of "Measurement Period") < 18

define "Stratification 3":
  AgeInYearsAt(start of "Measurement Period") >= 18
    and AgeInYearsAt(start of "Measurement Period") < 50

define "Stratification 4":
  AgeInYearsAt(start of "Measurement Period") >= 50
    and AgeInYearsAt(start of "Measurement Period") <= 64

context Unfiltered

define "MMA Measure Score 1":
  Sum("Numerator Medication Compliance 50%") / Sum(Denominator)

define "MMA Measure Score 2":
  Sum("Numerator Medication Compliance 75%") / Sum(Denominator)