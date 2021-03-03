library medication_management_for_people_with_asthma version '1'

using FHIR version '4.0.0'
include FHIRHelpers version '4.0.0' called FHIRHelpers

codesystem "SNOMED-CT": 'http://snomed.info/sct' version '20200301'

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
code "Montelukast": '372897005' from "SNOMED-CT" display 'Albuterol'
code "Zafirlukast": '116090007' from "SNOMED-CT" display 'Levalbuterol'
code "Zileuton": '108617005' from "SNOMED-CT" display 'Dyphylline-guaifenesin'

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

//parameter MeasurementPeriod default Interval[@2018-12-31T00:00:00.0, @2019-12-31T00:00:00.0)
parameter "Measurement Period" default Interval[@2019-01-01T00:00:00.0, @2019-12-31T23:59:59.9)
parameter "Year Before Measurement Period" default Interval[@2018-01-01T00:00:00.0, @2018-12-31T23:59:59.9)

context Patient


define "In Demographic":
	AgeInYearsAt(start of "Measurement Period") >= 5
    and AgeInYearsAt(start of "Measurement Period") < 64

define "Emergency Department Visit":
  [Encounter: "ED"] E
    without [Encounter: "Telehealth Modifier"] E1
      such that exists(E1)
    without [Encounter: "Telehealth POS"] E2
      such that exists(E2)
    with [Condition: "Asthma"] C
      such that E.period starts during "Measurement Period"

define "Acute Inpatient Encounter Without Telehealth":
  [Encounter: "Acute Inpatient"] E
    without [Encounter: "Telehealth Modifier"] E2
      such that exists(E2)
    without [Encounter: "Telehealth POS"] E3
      such that exists(E3)
    with [Condition: "Asthma"] C
      such that E.status = 'finished' and E.period starts during "Measurement Period"
  
define "Acute Inpatient Discharge":
  [Encounter: "Acute Inpatient"] E
    with [Condition: "Asthma"] Asthma
      such that E.status = 'finished'
      and E.period starts during "Measurement Period"

define "Outpatient Visit":
  [Encounter: "Outpatient"] E
    with [Condition: "Asthma"] C
      such that E.period starts during "Measurement Period"

define "Observation Visit":
  [Encounter: "Observation Encounter"] E
    with [Condition: "Asthma"] C
      such that E.period starts during "Measurement Period"

define "Telehealth POS Visit":
  [Encounter: "Telehealth POS"] E
    with [Condition: "Asthma"] C
      such that E.period starts during "Measurement Period"

define "Telehealth Modifier Visit":
  [Encounter: "Telehealth Modifier"] E
    with [Condition: "Asthma"] C
      such that E.period starts during "Measurement Period"

define "Telephone Visit":
  [Encounter: "Telephone Visits"] E
    with [Condition: "Asthma"] C
      such that E.period starts during "Measurement Period"

define "Online Assessment":
  [Encounter: "Online Assessments"] E
    with [Condition: "Asthma"] C
      such that E.period starts during "Measurement Period"

define "Tele Visits on Different Dates":
  from
    "Telehealth Modifier Visit" cond1,
    "Telephone Visit" cond2,
    "Online Assessment" cond3,
    "Telehealth POS Visit" cond4
      where (cond1.period.start != cond2.period.start)
        and (cond1.period.start != cond3.period.start)
        and (cond1.period.start != cond4.period.start)
        and (cond2.period.start != cond3.period.start)
        and (cond2.period.start != cond4.period.start)
        and (cond3.period.start != cond4.period.start)
    return Count((((cond1 union cond2) union cond3) union cond4))

define "Tele Visits - Max of Three":
  case "Tele Visits on Different Dates" >= 3
    when true then 3
    else "Tele Visits on Different Dates"
  end

define "Other Visits on Different Dates":
  from
    "Outpatient Visit" cond1,
    "Observation Visit" cond2
      where (cond1.period.start != cond2.period.start)
    return Count(cond1 union cond2) 

define "At Least 4 Visits":
  "Tele Visits - Max of Three" + "Other Visits on Different Dates" >= 4

define "Non-Leukotriene Medication":
  Count([MedicationDispense] MedicationDispense
    where FHIRHelpers.ToCode(MedicationDispense.medication.coding) ~ "Asthma Medication")

define "Leukotriene Medication":
  Count([MedicationDispense] MedicationDispense
    where FHIRHelpers.ToCode(MedicationDispense.medication.coding) ~ "Leukotriene Based Medication")

define "Asthma Condition":
  exists([Condition: "Asthma"] C
    where C.onset during "Measurement Period")

define "Persistent Asthma":
  case 
    when "Non-Leukotriene Medication" = 0 and "Leukotriene Medication" >= 4 and "Asthma Condition" then true
    when "Non-Leukotriene Medication" != 0 and "Non-Leukotriene Medication" + "Leukotriene Medication" >= 4 then true
    else false
  end


define "Valid Encounters":
  "Emergency Department Visit"
  union "Acute Inpatient Encounter Without Telehealth"
  union "Acute Inpatient Discharge"
  
  //union "At Least 4 Visits"

  // union "Persistent Asthma"


define "Exclusion Diagnoses":
  [Condition: "Emphysema"]
  // union [Condition: "Other Emphysema"]
  union [Condition: "COPD"]
  union [Condition: "Obstructive Chronic Bronchitus"]
  // union [Condition: "Chronic Respiratory Conditions Due to Fumes or Vapors"
  union [Condition: "Cystic Fibrosis"]
  union [Condition: "Acute Respiratory Failure"]

//union "Non-Leukotriene Medication" + "Leukotriene Medication" = 0

define Denominator:
  "In Demographic"
    and (exists("Valid Encounters" during "Measurement Period") and not exists("Exclusion Diagnoses" during "Measurement Period"))
    and (exists("Valid Encounters" during "Year Before Measurement Period") and not exists("Exclusion Diagnoses" during "Year Before Measurement Period"))

// define "Denominator":
  // case ("Initial Population" and "Diabetes Condition Denominator" and not "Diabetes Exclusions")
    // when true then 1
    // else 0
  // end

define "Active Diagnoses During Measurement Period":
  "Exclusion Diagnoses" D where Interval[D.onset, D.abatement] overlaps "Measurement Period"

define "Denominator Exclusions":
  exists ("Active Diagnoses During Measurement Period")

define "Index Prescription Start Date":
  First([MedicationDispense] C sort by whenHandedOver desc).whenHandedOver

define "Treatment Period": 
  days between @2019-12-31 and "Index Prescription Start Date" 

// define "Earliest Medication Start Date":
  // [MedicationDispense] C  
    // sort by daysSupply.whenHandedOver desc

// define function CumulativeDuration(Intervals List<Tuple{start: FHIR.dateTime, end: FHIR.dateTime}>):
define function CumulativeDuration(Intervals List<Interval<DateTime>>):
  Sum((collapse Intervals) X return all duration in days of X)

define "Medication in Date Range":
  [MedicationDispense] E 
    where Interval[E.whenHandedOver, E.whenHandedOver + E.daysSupply] overlaps "Measurement Period" 
    return Interval[E.whenHandedOver, E.whenHandedOver + E.daysSupply]

define "Days Covered":
  CumulativeDuration("Medication in Date Range")

define "Proportion of Days Covered":
  Round("Days Covered" / "Treatment Period" * 100)


define "Numerator Medication Compliance 50%":
  [MedicationDispense: "Preferred Asthma Therapy"] P where Interval[P.whenPrepared, P.whenHandedOver] during "Measurement Period"

define "Numerator Medication Compliance 75%":
  [MedicationDispense: "Preferred Asthma Therapy"] P where Interval[P.whenPrepared, P.whenHandedOver] during "Measurement Period"

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

// define "Denominator Count":
  // Sum(Denominator)

// define "Numerator Count":
  // Sum(Numerator)

// define "CDC Measure Score":
  // Sum(Numerator) / Sum(Denominator)
