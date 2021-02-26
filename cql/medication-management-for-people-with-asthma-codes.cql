library medication_management_for_people_with_asthma version '1'

/*
This example is a work in progress and should not be considered a final specification
or recommendation for guidance. This example will help guide and direct the process
of finding conventions and usage patterns that meet the needs of the various stakeholders
in the measure development community.
*/

using FHIR version '4.0.0'
include FHIRHelpers version '4.0.0' called FHIRHelpers

valueset "Acute Respiratory Failure": '2.16.840.1.113883.3.464.1003.102.12.1018'
valueset "Chronic Obstructive Pulmonary Disease": '2.16.840.1.113883.3.464.1003.102.12.1007'
valueset "Cystic Fibrosis": '2.16.840.1.113883.3.464.1003.102.12.1002'
valueset "Emphysema": '2.16.840.1.113883.3.464.1003.102.12.1004'
valueset "Persistent Asthma": '2.16.840.1.113883.3.464.1003.102.12.1023'
valueset "Face-to-Face Interaction": '2.16.840.1.113883.3.464.1003.101.12.1048'
valueset "Home Healthcare Services": '2.16.840.1.113883.3.464.1003.101.12.1016'
valueset "Office Visit": '2.16.840.1.113883.3.464.1003.101.12.1001'
valueset "Preventive Care - Established Office Visit, 0 to 17": '2.16.840.1.113883.3.464.1003.101.12.1024'
valueset "Preventive Care Services - Established Office Visit, 18 and Up": '2.16.840.1.113883.3.464.1003.101.12.1025'
valueset "Preventive Care Services-Initial Office Visit, 18 and Up": '2.16.840.1.113883.3.464.1003.101.12.1023'
valueset "Preventive Care- Initial Office Visit, 0 to 17": '2.16.840.1.113883.3.464.1003.101.12.1022'
valueset "Preferred Asthma Therapy": '2.16.840.1.113883.3.464.1003.196.12.1212'

parameter MeasurementPeriod Interval<DateTime>

context Patient


define InDemographic:
	AgeInYearsAt(start of MeasurementPeriod) >= 5
    and AgeInYearsAt(start of MeasurementPeriod) < 64

define ActivePersistentAsthmaDiagnosis:
  [Condition: "Persistent Asthma"] A 
    where Interval[A.onset, A.abatement] overlaps MeasurementPeriod

define ValidEncounters:
  ([Encounter: "Office Visit"]
		union [Encounter: "Home Healthcare Services"]
		union [Encounter: "Face-to-Face Interaction"]
		union [Encounter: "Preventive Care - Established Office Visit, 0 to 17"]
		union [Encounter: "Preventive Care Services - Established Office Visit, 18 and Up"]
		union [Encounter: "Preventive Care Services-Initial Office Visit, 18 and Up"]
    union [Encounter: "Preventive Care- Initial Office Visit, 0 to 17"]) QualifyingEncounter
    where QualifyingEncounter.period during MeasurementPeriod


define EncountersDuringMeasurementPeriod:
	ValidEncounters E where Interval[E.period.start, E.period.end] during MeasurementPeriod

define InitialPopulation:
  InDemographic
    and exists (ActivePersistentAsthmaDiagnosis)
    and exists (EncountersDuringMeasurementPeriod)

define Denominator:
  InitialPopulation

define ActiveDiagnoses:
  [Condition: "Chronic Obstructive Pulmonary Disease"]
    union [Condition: "Emphysema"]
    union [Condition: "Cystic Fibrosis"]
    union [Condition: "Acute Respiratory Failure"]

define ActiveDiagnosesDuringMeasurementPeriod:
  ActiveDiagnoses D where Interval[D.onset, D.abatement] overlaps MeasurementPeriod

define DenominatorExclusions:
  exists (ActiveDiagnosesDuringMeasurementPeriod)

define Numerator:
  [MedicationDispense: "Preferred Asthma Therapy"] P where Interval[P.whenPrepared, P.whenHandedOver] during MeasurementPeriod

define Stratification1:
  AgeInYearsAt(start of MeasurementPeriod) >= 5
    and AgeInYearsAt(start of MeasurementPeriod) < 11

define Stratification2:
  AgeInYearsAt(start of MeasurementPeriod) >= 11
    and AgeInYearsAt(start of MeasurementPeriod) < 18

define Stratification3:
  AgeInYearsAt(start of MeasurementPeriod) >= 18
    and AgeInYearsAt(start of MeasurementPeriod) < 50

define Stratification4:
  AgeInYearsAt(start of MeasurementPeriod) >= 50
    and AgeInYearsAt(start of MeasurementPeriod) < 64