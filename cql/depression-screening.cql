/*
Depression Screening and Follow-Up for Adolescents and Adults (DSF)
*/

library depression_screening_and_followup version '1.0.0'

using FHIR version '4.0.0'
include FHIRHelpers version '4.0.0' called FHIRHelpers

/*
Measure Description
The percentage of members 12 years of age and older who were screened for
		clinical depression using a standardized tool and, if screened positive,
		who received appropriate follow-up care. Two rates are reported.
	1. Depression Screening. The percentage of members who were screened for
		clinical depression using a standardized tool.
	2. Follow-Up on Positive Screen. The percentage of members who screened
		positive for depression and received appropriate follow-up care within 30 days.
*/
codesystem "RXNORM": 'RXNORM'
codesystem "LOINC": 'http://loinc.org'
codesystem "SNOMED": 'http://snomed.info/sct'
codesystem "CQFramework": 'http://cqframework.info/codesystem/placeholder'


/* The following Valuesets come from VSAC*/
valueset "Behavioral Health Follow-up Visit": '2.16.840.1.113883.3.464.1003.101.12.1054'
valueset "Bipolar Disorder": '2.16.840.1.113883.3.67.1.101.1.128'
valueset "Depression Diagnosis": '2.16.840.1.113883.3.600.145'
valueset "Depression Screening Encounter": '2.16.840.1.113762.1.4.1138.536'
valueset "Depression Screen": '2.16.840.1.113762.1.4.1182.97'
valueset "Ambulatory/ED Visit": '2.16.840.1.113883.3.464.1003.101.12.1061'
valueset "Negative Depression Screening": '2.16.840.1.113883.3.7587.3.1020'
valueset "Other Bipolar Disorder": '2.16.840.1.113883.3.464.1003.105.12.1204'
valueset "Positive Depression Screening": '2.16.840.1.113883.3.7587.3.1019'
valueset "Dysthymia": '2.16.840.1.113883.3.67.1.101.1.254'
valueset "Antidepressant Medication": '2.16.840.1.113883.3.464.1003.196.12.1213'
valueset "Hospice Services": '2.16.840.1.113762.1.4.1182.2'
/*
The following valuesets come from K. Health Plan Description AND ECDS_pp 557-650. 
We probably want to use these in the future with real data and after we figure out the value code sets from the HEDIS b
*/

//valueset "Bipolar Disorder": '2.16.840.1.113883.3.464.1004.1044'
//valueset "Depression": '2.16.840.1.113883.3.464.1004.1390'
//valueset "Other Bipolar Disorder": '2.16.840.1.113883.3.464.1004.1399'
//valueset "Behavioral Health Encounter": '2.16.840.1.113883.3.464.1004.1383'
//valueset "Depression Case Management Encounter": '2.16.840.1.113883.3.464.1004.1389'
//valueset "Follow Up Visit": '2.16.840.1.113883.3.464.1004.1385'
//valueset "Hospice Encounter": '2.16.840.1.113883.3.464.1004.1761'
//valueset "Hospice Intervention": '2.16.840.1.113883.3.464.1004.1762'
//valueset "Hospice Intervention" '2.16.840.1.113883.3.464.1004.1762'
//valueset "Antidepressant Medication": '2.16.840.1.113883.3.464.1004.1503'


//code "Antidepressant Medication": '1000048' from "RXNORM"
code "PHQ-9 Modified Score": '00009' from "CQFramework"
code "PHQ-9 Tool": '44249-1' from "LOINC"


parameter "Measurement Period" default Interval[@2020-01-01, @2020-12-31]


define "First Predecessor Year":
	Interval[start of "Measurement Period" - 1 year, start of "Measurement Period")

/*
This library evaluates with respect to exactly 1 candidate patient at a time,
that patient being given by the special context parameter Patient.
*/

context Patient

/*
Initial Population
Product lines -- Commercial, Medicaid, Medicare (report each product line separately).
*/

define "Initial Population":
	AgeInYearsAt(start of "Measurement Period") >= 12

/*
Exclusions
*/
define "Denominator Exclusion":
	exists (
		"Bipolar Disorder Reports" BD
			where BD.status.value in { 'preliminary', 'final', 'amended', 'corrected', 'appended' }
				and PeriodToIntervalOfDT(BD.effective) overlaps "First Predecessor Year"
	)
	or
	exists (
		[DiagnosticReport: "Dysthymia"] MDD
			where MDD.status.value in { 'preliminary', 'final', 'amended', 'corrected', 'appended' }
				and PeriodToIntervalOfDT(MDD.effective) overlaps "First Predecessor Year"
	)
	or
	exists (
		[ServiceRequest: "Hospice Services"] HospicePerformed
			where PeriodToIntervalOfDT(HospicePerformed.occurrence) during "Measurement Period"
	)

define "Bipolar Disorder Reports":
	[DiagnosticReport: "Bipolar Disorder"]
		// union [DiagnosticReport: "Bipolar Disorder ECDS"] this one is for whenver we use th code systems in the HEDIS book since it is not found in VSAC
		union [DiagnosticReport: "Other Bipolar Disorder"]

/*
Denominators and Numerators
*/

// Depression Screening
define "Denominator 1":
	case ("Initial Population" and not "Denominator Exclusion")
		when true then 1
		else 0
	end

// Depression Screening
define "Numerator 1":
	case("Initial Population"
	and
	exists (
		[Observation: "Depression Screen"] DepressionScreen
			where DepressionScreen.status.value in { 'final', 'amended' }
				and DepressionScreen.effective.value in "Measurement Period"
	))
		when true then 1
		else 0
	end

// Positive Follow-Up
define "Denominator 2":
	case("Initial Population"
		and exists ("Positive Depression Screening During Follow-Up Period"))
		when true then 1
		else 0
	end

define "Numerator 2":
	case("Initial Population"
		and
		(
			exists ("Dispensed Antidepressant Within 31 Days")
			or exists ("Follow-Up Encounter Within 31 Days")
			or exists ("Same Day Behavioral Encounter")
			or exists ("Negative Depression Screening Within 31 Days")
		))
		when true then 1
		else 0
	end

define "Positive Depression Screening During Follow-Up Period":
	[Observation: "Positive Depression Screening"] PositiveScreen
		where PositiveScreen.status.value in { 'final', 'amended' }
			and PositiveScreen.effective.value in "Measurement Period"

define "First Positive Depression Screening During Follow-Up Period":
	{First(
		"Positive Depression Screening During Follow-Up Period" Obs
			sort by effective.value
	)}

define "Follow-Up Care Encounters":
	distinct (
		[Encounter: "Behavioral Health Follow-up Visit"]
		union
		(
			[Encounter: "Ambulatory/ED Visit"] E
				with [DiagnosticReport: "Dysthymia"] D
					such that E.status.value in { 'planned', 'arrived', 'triaged', 'in-progress', 'onleave', 'finished' }
						and D.status.value in { 'preliminary', 'final', 'amended', 'corrected', 'appended' }
						and PeriodToIntervalOfDT(D.effective) overlaps PeriodToIntervalOfDT(E.period)
		)
		union
		[Encounter: "Depression Screening Encounter"]
	) Enc
		where Enc.status.value in { 'planned', 'arrived', 'triaged', 'in-progress', 'onleave', 'finished' }

define "Same Day Behavioral Encounter":
	[Encounter: "Behavioral Health Follow-up Visit"] BehavioralEncounter
		with "First Positive Depression Screening During Follow-Up Period" PositiveScreen
			such that BehavioralEncounter.status.value in { 'planned', 'arrived', 'triaged', 'in-progress', 'onleave', 'finished' }
				and start of PeriodToIntervalOfDT(BehavioralEncounter.period) same day as PositiveScreen.effective.value
	return BehavioralEncounter

define "Dispensed Antidepressant Within 31 Days":
	[MedicationDispense: "Antidepressant Medication"] Antidepressants 
		with "First Positive Depression Screening During Follow-Up Period" PositiveScreen
			such that Antidepressants.status.value = 'completed'
				and days between Antidepressants.whenHandedOver.value and PositiveScreen.effective.value <= 31
	return Antidepressants

define "Follow-Up Encounter Within 31 Days":
	"Follow-Up Care Encounters" FollowUps
		with "First Positive Depression Screening During Follow-Up Period" PositiveScreen
			such that days between start of PeriodToIntervalOfDT(FollowUps.period) and PositiveScreen.effective.value >= 1
				and days between start of PeriodToIntervalOfDT(FollowUps.period) and PositiveScreen.effective.value <= 31
	return FollowUps

define "Negative Depression Screening Within 31 Days":
	[Observation: "Negative Depression Screening"] NegativeScreen
		with "First Positive Depression Screening During Follow-Up Period" PositiveScreen
			such that NegativeScreen.status.value in { 'final', 'amended' }
				and days between NegativeScreen.effective.value and PositiveScreen.effective.value <= 31
	return NegativeScreen

/*
Stratifiers for Commercial
*/

define "Stratifier 1":
	AgeInYearsAt(start of "Measurement Period") in Interval[12, 17]

define "Stratifier 2":
	AgeInYearsAt(start of "Measurement Period") in Interval[18, 44]

define "Stratifier 3":
	AgeInYearsAt(start of "Measurement Period") in Interval[45, 64]

define "Stratifier 4":
	AgeInYearsAt(start of "Measurement Period") >= 65

/*
Stratifiers for Medicaid
*/
/*
define "Stratifier 5":
	AgeInYearsAt(start of "Measurement Period") in Interval[12, 17]

define "Stratifier 6":
	AgeInYearsAt(start of "Measurement Period") in Interval[18, 44]

define "Stratifier 7":
	AgeInYearsAt(start of "Measurement Period") in Interval[45, 64]

define "Stratifier 8":
	AgeInYearsAt(start of "Measurement Period") >= 65
*/

/*
Stratifiers for Medicare
*/

/*
define "Stratifier 9":
	AgeInYearsAt(start of "Measurement Period") in Interval[18, 44]

define "Stratifier 10":
	AgeInYearsAt(start of "Measurement Period") in Interval[45, 64]

define "Stratifier 11":
	AgeInYearsAt(start of "Measurement Period") >= 65
*/

context Unfiltered

define "Denominator Count":
  Sum("Denominator 1") + Sum("Denominator 2")

define "Numerator Count":
  Sum("Numerator 1") + Sum("Numerator 2")

define "CDC Measure Score":
  Sum("Numerator Count") / Sum("Denominator Count")

/*
Utility Functions
*/

define function PeriodToIntervalOfDT(value FHIR.Period):
	Interval[value."start".value, value."end".value]
