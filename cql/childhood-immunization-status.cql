library childhood_immunization_status version '1'

using FHIR version '4.0.0'
include FHIRHelpers version '4.0.0' called FHIRHelpers

valueset "Anaphylactic Reaction to DTaP Vaccine": '2.16.840.1.113883.3.464.1003.199.12.1031'
valueset "Anaphylactic Reaction to Hemophilus Influenza B (HiB) Vaccine": '2.16.840.1.113883.3.464.1003.199.12.1030'
valueset "Anaphylactic Reaction to Hepatitis A Vaccine": '2.16.840.1.113883.3.464.1003.199.12.1026'
valueset "Anaphylactic Reaction to Hepatitis B Vaccine": '2.16.840.1.113883.3.464.1003.199.12.1029'
valueset "Anaphylactic Reaction to Inactivated Polio Vaccine (IPV)": '2.16.840.1.113883.3.464.1003.199.12.1023'
valueset "Anaphylactic Reaction to Influenza Vaccine": '2.16.840.1.113883.3.464.1003.199.12.1022'
valueset "Anaphylactic Reaction to Neomycin": '2.16.840.1.113883.3.464.1003.199.12.1024'
valueset "Anaphylactic Reaction to Pneumococcal Conjugate Vaccine": '2.16.840.1.113883.3.464.1003.199.12.1027'
valueset "Anaphylactic Reaction to Polymyxin": '2.16.840.1.113883.3.464.1003.199.12.1025'
valueset "Anaphylactic Reaction to Rotavirus Vaccine": '2.16.840.1.113883.3.464.1003.199.12.1021'
valueset "Anaphylactic Reaction to Streptomycin": '2.16.840.1.113883.3.464.1003.199.12.1028'
valueset "Discharged to Home for Hospice Care": '2.16.840.1.113883.3.117.1.7.1.209'
valueset "Discharged to Health Care Facility for Hospice Care": '2.16.840.1.113883.3.117.1.7.1.207'
valueset "Disorders of the Immune System": '2.16.840.1.113883.3.464.1003.120.12.1001'
valueset "DTaP Vaccine": '2.16.840.1.113883.3.464.1003.196.12.1214'
valueset "DTaP Vaccine Administered": '2.16.840.1.113883.3.464.1003.110.12.1022'
valueset "Encephalopathy due to Childhood Vaccination": '2.16.840.1.113883.3.464.1003.114.12.1007'
valueset "Encounter Inpatient": '2.16.840.1.113883.3.666.5.307'
valueset "Face-to-Face Interaction": '2.16.840.1.113883.3.464.1003.101.12.1048'
valueset "Haemophilus Influenzae Type B (HiB) Vaccine": '2.16.840.1.113883.3.464.1003.196.12.1217'
valueset "Haemophilus Influenzae Type B (HiB) Vaccine Administered": '2.16.840.1.113883.3.464.1003.110.12.1043'
valueset "Hepatitis A": '2.16.840.1.113883.3.464.1003.110.12.1024'
valueset "Hepatitis A Vaccine": '2.16.840.1.113883.3.464.1003.196.12.1215'
valueset "Hepatitis A Vaccine Administered": '2.16.840.1.113883.3.464.1003.110.12.1041'
valueset "Hepatitis B": '2.16.840.1.113883.3.464.1003.110.12.1025'
valueset "Hepatitis B Vaccine": '2.16.840.1.113883.3.464.1003.196.12.1216'
valueset "Hepatitis B Vaccine Administered": '2.16.840.1.113883.3.464.1003.110.12.1042'
valueset "HIV": '2.16.840.1.113883.3.464.1003.120.12.1003'
valueset "Home Healthcare Services": '2.16.840.1.113883.3.464.1003.101.12.1016'
valueset "Hospice care ambulatory": '2.16.840.1.113762.1.4.1108.15'
valueset "Inactivated Polio Vaccine (IPV)": '2.16.840.1.113883.3.464.1003.196.12.1219'
valueset "Inactivated Polio Vaccine (IPV) Administered": '2.16.840.1.113883.3.464.1003.110.12.1045'
valueset "Influenza Vaccine": '2.16.840.1.113883.3.464.1003.196.12.1218'
valueset "Influenza Vaccine Administered": '2.16.840.1.113883.3.464.1003.110.12.1044'
valueset "Influenza Virus Vaccine and Vaccination": '2.16.840.1.113762.1.4.1221.108'
valueset "Intussusception": '2.16.840.1.113883.3.464.1003.199.12.1056'
valueset "Malignant Neoplasm of Lymphatic Tissue": '2.16.840.1.113883.3.464.1003.108.11.1054'
valueset "Measles": '2.16.840.1.113883.3.464.1003.110.12.1053'
valueset "Measles Antibody Test (IgG Antibody presence)": '2.16.840.1.113883.3.464.1003.198.12.1060'
valueset "Measles Antibody Test (IgG Antibody Titer)": '2.16.840.1.113883.3.464.1003.198.12.1059'
valueset "Measles, Mumps and Rubella (MMR) Vaccine": '2.16.840.1.113883.3.464.1003.196.12.1224'
valueset "Measles, Mumps and Rubella (MMR) Vaccine Administered": '2.16.840.1.113883.3.464.1003.110.12.1031'
valueset "Mumps": '2.16.840.1.113883.3.464.1003.110.12.1032'
valueset "Mumps Antibody Test (IgG Antibody presence)": '2.16.840.1.113883.3.464.1003.198.12.1062'
valueset "Mumps Antibody Test (IgG Antibody Titer)": '2.16.840.1.113883.3.464.1003.198.12.1061'
valueset "Office Visit": '2.16.840.1.113883.3.464.1003.101.12.1001'
valueset "Pneumococcal Conjugate Vaccine": '2.16.840.1.113883.3.464.1003.196.12.1221'
valueset "Pneumococcal Conjugate Vaccine Administered": '2.16.840.1.113883.3.464.1003.110.12.1046'
valueset "Positive Finding": '2.16.840.1.113883.3.464.1003.121.12.1016'
valueset "Preventive Care, Established Office Visit, 0 to 17": '2.16.840.1.113883.3.464.1003.101.12.1024'
valueset "Preventive Care Services, Initial Office Visit, 0 to 17": '2.16.840.1.113883.3.464.1003.101.12.1022'
valueset "Rotavirus Vaccine (2 dose schedule)": '2.16.840.1.113883.3.464.1003.196.12.1222'
valueset "Rotavirus Vaccine (2 dose schedule) Administered": '2.16.840.1.113883.3.464.1003.110.12.1048'
valueset "Rotavirus Vaccine (3 dose schedule)": '2.16.840.1.113883.3.464.1003.196.12.1223'
valueset "Rotavirus Vaccine (3 dose schedule) Administered": '2.16.840.1.113883.3.464.1003.110.12.1047'
valueset "Rubella": '2.16.840.1.113883.3.464.1003.110.12.1037'
valueset "Rubella Antibody Test (IgG Antibody presence)": '2.16.840.1.113883.3.464.1003.198.12.1064'
valueset "Rubella Antibody Test (IgG Antibody Titer)": '2.16.840.1.113883.3.464.1003.198.12.1063'
valueset "Varicella Zoster": '2.16.840.1.113883.3.464.1003.110.12.1039'
valueset "Severe Combined Immunodeficiency": '2.16.840.1.113883.3.464.1003.120.12.1007'
valueset "Varicella Zoster Antibody Test (IgG Antibody Presence)": '2.16.840.1.113883.3.464.1003.198.12.1067'
valueset "Varicella Zoster Antibody Test (IgG Antibody Titer)": '2.16.840.1.113883.3.464.1003.198.12.1066'
valueset "Varicella Zoster Vaccine (VZV)": '2.16.840.1.113883.3.464.1003.196.12.1170'
valueset "Varicella Zoster Vaccine (VZV) Administered": '2.16.840.1.113883.3.464.1003.110.12.1040'


// The following codes are referenced in the HEDIS spec,
// but don't exist in the value set authority or the NIH's database 
/*
valueset "Rubella Immunization": '2.16.840.1.113883.3.464.1004.1789'
valueset "Rubella Vaccine Procedure": '2.16.840.1.113883.3.464.1004.1790'
valueset "Measles Immunization": '2.16.840.1.113883.3.464.1004.1771'
valueset "Measles Rubella Immunization": '2.16.840.1.113883.3.464.1004.1775'
valueset "Measles Rubella Vaccine Procedure": '2.16.840.1.113883.3.464.1004.1776'
valueset "Measles Vaccine Procedure": '2.16.840.1.113883.3.464.1004.1772'
valueset "Mumps Immunization":'2.16.840.1.113883.3.464.1004.1779'
valuset "Mumps Vaccine Procedure":'2.16.840.1.113883.3.464.1004.1780'
valueset "Newborn Hepatitis B Vaccine Administered":'2.16.840.1.113883.3.464.1004.1397'
valueset "Anaphylactic Reaction to Common Baker's Yeast": '2.16.840.1.113883.3.464.1003.199.12.1032'
*/

parameter "Measurement Period" default Interval[@2020-01-01T00:00:00.0, @2020-12-31T23:59:59.999)

context Patient

define "Initial Population":
	AgeInYearsAt(start of "Measurement Period")>= 1
	and AgeInYearsAt(end of "Measurement Period")= 2

define "DTaP Immunizations or Procedures":
	( [Immunization: "DTaP Vaccine"]
		union [Procedure: "DTaP Vaccine Administered"]) DTaPVaccination
			where AgeInDaysAt(Coalesce(DTaPVaccination.performed.start, DTaPVaccination.occurrence))>= 42
			and AgeInDaysAt(Coalesce(DTaPVaccination.performed.start, DTaPVaccination.occurrence))<= 730

define "DTaP Vaccinations":
	from
		"DTaP Immunizations or Procedures" Vaccination1,
		"DTaP Immunizations or Procedures" Vaccination2,
		"DTaP Immunizations or Procedures" Vaccination3,
		"DTaP Immunizations or Procedures" Vaccination4
		where Coalesce(Vaccination2.performed.start, Vaccination2.occurrence) 1 day or more after Coalesce(Vaccination1.performed.start, Vaccination1.occurrence)
			and Coalesce(Vaccination3.performed.start, Vaccination3.occurrence) 1 day or more after Coalesce(Vaccination2.performed.start, Vaccination2.occurrence) 
			and Coalesce(Vaccination4.performed.start, Vaccination4.occurrence) 1 day or more after Coalesce(Vaccination3.performed.start, Vaccination3.occurrence)
		return Vaccination1

// Exclusions are commented out because they are optional 
// additionally, there are a few exclusions in the spec we can't figure out 
// define "DTaP Exclusions":
	// ( [Condition: "Anaphylactic Reaction to DTaP Vaccine"]
		// union [Condition: "Encephalopathy due to Childhood Vaccination"] ) DPaTExclusions
		// where AgeInDaysAt(Coalesce(DPaTExclusions.onset.start, DPaTExclusions.onset))<= 730

define "DTaP Criteria Met":
	exists("DTaP Vaccinations") // and not exists("DTaP Exclusions")

define "Hepatitis A Vaccinations":
	((([Immunization: "Hepatitis A Vaccine"]
		union [Procedure: "Hepatitis A Vaccine Administered"]) HepAVaccination
		where AgeInDaysAt(Coalesce(HepAVaccination.performed.start, HepAVaccination.occurrence)) >= 365
			and AgeInDaysAt(Coalesce(HepAVaccination.performed.start, HepAVaccination.occurrence)) <= 730
	)
	union ([Condition: "Hepatitis A"] HepACondition
		where AgeInDaysAt(Coalesce(HepACondition.onset, HepACondition.onset.start)) <= 730)) HepA
	return HepA

define "Numerator Compliant Hepatitis A Conditions":
	[Condition: "Hepatitis A"] HepAConditions
		where AgeInDaysAt(Coalesce(HepAConditions.onset.start, HepAConditions.onset))<= 730

// define "Hepatitis A Exclusions":
	// [Condition: "Anaphylactic Reaction to Hepatitis A Vaccine"]

define "Hepatitis A Criteria Met":
	(exists("Hepatitis A Vaccinations") or exists("Numerator Compliant Hepatitis A Conditions")) // and not exists("Hepatitis A Exclusions")

define "Hepatitis B Immunizations or Procedures":
	( [Immunization: "Hepatitis B Vaccine"]
		union [Procedure: "Hepatitis B Vaccine Administered"]) HepBVaccination
		where (AgeInDaysAt(Coalesce(HepBVaccination.performed.start, HepBVaccination.occurrence))<= 730
		or AgeInDaysAt(Coalesce(HepBVaccination.performed.start, HepBVaccination.occurrence)) < 8)

define "Hepatitis B Vaccinations":
	from
		"Hepatitis B Immunizations or Procedures" Vaccination1,
		"Hepatitis B Immunizations or Procedures" Vaccination2,
		"Hepatitis B Immunizations or Procedures" Vaccination3
		where Coalesce(Vaccination2.performed.start, Vaccination2.occurrence) 1 day or more after Coalesce(Vaccination1.performed.start, Vaccination1.occurrence)
			and Coalesce(Vaccination3.performed.start, Vaccination3.occurrence) 1 day or more after Coalesce(Vaccination2.performed.start, Vaccination2.occurrence) 
		return Vaccination1

define "Numerator Compliant Hepatitis B Conditions":
	[Condition: "Hepatitis B"] HepBConditions
		where AgeInDaysAt(Coalesce(HepBConditions.onset.start, HepBConditions.onset))<= 730

// define "Hepatitis B Exclusions":
	// ( 
		// [Condition: "Anaphylactic Reaction to Hepatitis B Vaccine"]
		// //union ( [Condition: "Anaphylactic Reaction to Hepatitis B Vaccine"]
		// //)
		// //union ( [Condition: "Anaphylactic Reaction to Common Baker's Yeast"] 
		// //)
	// ) HepBExclusions
		// where AgeInDaysAt(Coalesce(HepBExclusions.onset.start, HepBExclusions.onset))<= 730

define "Hepatitis B Criteria Met":
	(exists("Hepatitis B Vaccinations") or exists("Numerator Compliant Hepatitis B Conditions")) // and not exists("Hepatitis B Exclusions")  

define "HIB Immunizations or Procedures":
	( [Immunization: "Haemophilus Influenzae Type B (HiB) Vaccine"] Vaccine
		union [Procedure: "Haemophilus Influenzae Type B (HiB) Vaccine Administered"] ) HiBVaccination
		where AgeInDaysAt(Coalesce(HiBVaccination.performed.start, HiBVaccination.occurrence))>= 42
			and AgeInDaysAt(Coalesce(HiBVaccination.performed.start, HiBVaccination.occurrence))<= 730

define "HIB Vaccinations":
	from
		"HIB Immunizations or Procedures" Vaccination1,
		"HIB Immunizations or Procedures" Vaccination2,
		"HIB Immunizations or Procedures" Vaccination3
		where Vaccination2.performed.start 1 day or more after Vaccination1.performed.start
			and Vaccination3.performed.start 1 day or more after Vaccination2.performed.start
		return Vaccination1

// define "HIB Exclusions":
	// [Condition: "Anaphylactic Reaction to Hemophilus Influenza B (HiB) Vaccine"] HIBReaction
		// where AgeInDaysAt(Coalesce(HIBReaction.onset.start, HIBReaction.onset))<= 730

define "HIB Criteria Met":
	exists("HIB Vaccinations") // and not exists("HIB Exclusions")

define "Influenza Immunizations or Procedures":
	( [Immunization: "Influenza Vaccine"]
		union [Procedure: "Influenza Vaccine Administered"]
			union [Procedure: "Influenza Virus Vaccine and Vaccination"]
				union [Immunization: "Influenza Virus Vaccine and Vaccination"]) FluVaccination
		where AgeInDaysAt(Coalesce(FluVaccination.performed.start, FluVaccination.occurrence))>= 180
			and AgeInDaysAt(Coalesce(FluVaccination.performed.start, FluVaccination.occurrence))<= 730

define "Influenza Vaccinations":
	from
		"Influenza Immunizations or Procedures" Vaccination1,
		"Influenza Immunizations or Procedures" Vaccination2
		where Coalesce(Vaccination2.performed.start, Vaccination2.occurrence) 1 day or more after Coalesce(Vaccination1.performed.start, Vaccination1.occurrence)
		return Vaccination1

// define "MMR, VZV and Influenza Exclusions":
	// ( [Condition: "Anaphylactic Reaction to Influenza Vaccine"]
		// union [Condition: "Malignant Neoplasm of Lymphatic Tissue"]
		// union [Condition: "Anaphylactic Reaction to Neomycin"]
		// union [Condition: "HIV"]
		// union [Condition: "Disorders of the Immune System"] ) InfluenzaConditions
		// where AgeInDaysAt(Coalesce(InfluenzaConditions.onset.start, InfluenzaConditions.onset))<= 730

define "Influenza Criteria Met":
	exists("Influenza Vaccinations") //and not exists("MMR, VZV and Influenza Exclusions")

define "IPV Immunizations or Procedures":
	( [Immunization: "Inactivated Polio Vaccine (IPV)"]
		union [Procedure: "Inactivated Polio Vaccine (IPV) Administered"] ) IPVVaccination
		where AgeInDaysAt(Coalesce(IPVVaccination.performed.start, IPVVaccination.occurrence))>= 42
			and AgeInDaysAt(Coalesce(IPVVaccination.performed.start, IPVVaccination.occurrence))<= 730

define "IPV Vaccinations":
	from
		"IPV Immunizations or Procedures" Vaccination1,
		"IPV Immunizations or Procedures" Vaccination2,
		"IPV Immunizations or Procedures" Vaccination3
		where Coalesce(Vaccination2.performed.start, Vaccination2.occurrence) 1 day or more after Coalesce(Vaccination1.performed.start, Vaccination1.occurrence)
			and Coalesce(Vaccination3.performed.start, Vaccination3.occurrence) 1 day or more after Coalesce(Vaccination2.performed.start, Vaccination2.occurrence) 
		return Vaccination1

// define "IPV Exclusions":
	// ( [Condition: "Anaphylactic Reaction to Inactivated Polio Vaccine (IPV)"]
		// union [Condition: "Anaphylactic Reaction to Streptomycin"]
		// union [Condition: "Anaphylactic Reaction to Polymyxin"]
		// union [Condition: "Anaphylactic Reaction to Neomycin"] ) IPVConditions
		// where AgeInDaysAt(Coalesce(IPVConditions.onset.start, IPVConditions.onset))<= 730

define "IPV Criteria Met":
	exists("IPV Vaccinations") // and not exists("IPV Exclusions")

define "Measles Indicators":
	( ( [Observation: "Measles Antibody Test (IgG Antibody Titer)"] Titer
			where Titer.value.value >= 1.10
	)
		union ( [Observation: "Measles Antibody Test (IgG Antibody presence)"] IgGPresence
				with IgGPresence.value.coding coding such that exists(
							IgGPresence.value.coding coding
              	where coding.code in "Positive Finding"
        )
		)
		union ( [Condition: "Measles"]
		) ) Measles
		where AgeInDaysAt(Coalesce(Measles.onset.start, Measles.onset, Measles.effective))<= 730


define "MMR Vaccinations":
	( [Immunization: "Measles, Mumps and Rubella (MMR) Vaccine"]
		union [Procedure: "Measles, Mumps and Rubella (MMR) Vaccine Administered"] ) MMRVaccination
		where AgeInDaysAt(Coalesce(MMRVaccination.performed.start, MMRVaccination.occurrence))<= 730
			and AgeInDaysAt(Coalesce(MMRVaccination.performed.start, MMRVaccination.occurrence))>= 365

define "Mumps Indicators":
	( ( [Observation: "Mumps Antibody Test (IgG Antibody Titer)"] Titer
			where Titer.value.value >= 1.10
	)
		union ( [Observation: "Mumps Antibody Test (IgG Antibody presence)"] IgGPresence
				with IgGPresence.value.coding coding such that exists(
							IgGPresence.value.coding coding
              	where coding.code in "Positive Finding"
        )
		)
		union ( [Condition: "Mumps"] )) Mumps
		where AgeInDaysAt(Coalesce(Mumps.onset.start, Mumps.onset, Mumps.effective))<= 730

define "MMR Criteria Met":
	exists ( "MMR Vaccinations" )
		or ( exists ( "Measles Indicators" )
				and exists ( "Mumps Indicators" )
				and exists ( "Rubella Indicators" )
		) // and not exists("MMR, VZV and Influenza Exclusions")

define "Pneumococcal Conjugate Immunizations or Procedures":
	( [Immunization: "Pneumococcal Conjugate Vaccine"]
		union [Procedure: "Pneumococcal Conjugate Vaccine Administered"] ) PneumococcalVaccination
		where AgeInDaysAt(Coalesce(PneumococcalVaccination.performed.start, PneumococcalVaccination.occurrence))>= 42
			and AgeInDaysAt(Coalesce(PneumococcalVaccination.performed.start, PneumococcalVaccination.occurrence))<= 730

define "Pneumococcal Conjugate Vaccinations":
	from
		"Pneumococcal Conjugate Immunizations or Procedures" Vaccination1,
		"Pneumococcal Conjugate Immunizations or Procedures" Vaccination2,
		"Pneumococcal Conjugate Immunizations or Procedures" Vaccination3,
		"Pneumococcal Conjugate Immunizations or Procedures" Vaccination4
		where Coalesce(Vaccination2.performed.start, Vaccination2.occurrence) 1 day or more after Coalesce(Vaccination1.performed.start, Vaccination1.occurrence)
			and Coalesce(Vaccination3.performed.start, Vaccination3.occurrence) 1 day or more after Coalesce(Vaccination2.performed.start, Vaccination2.occurrence) 
			and Coalesce(Vaccination4.performed.start, Vaccination4.occurrence) 1 day or more after Coalesce(Vaccination3.performed.start, Vaccination3.occurrence)
		return Vaccination1

// define "Pneumococcal Conjugate Exclusions":
	// [Condition: "Anaphylactic Reaction to Pneumococcal Conjugate Vaccine"] PCVReaction
		// where AgeInDaysAt(Coalesce(PCVReaction.onset.start, PCVReaction.onset))<= 730

define "Pneumococcal Conjugate Criteria Met":
	exists("Pneumococcal Conjugate Vaccinations") // and not exists("Pneumococcal Conjugate Exclusions")

define "Qualifying Encounter":
	( [Encounter: "Office Visit"]
		union [Encounter: "Face-to-Face Interaction"]
		union [Encounter: "Home Healthcare Services"]
		union [Encounter: "Preventive Care, Established Office Visit, 0 to 17"]
		union [Encounter: "Preventive Care Services, Initial Office Visit, 0 to 17"] ) QualifyingEncounter
		where QualifyingEncounter.period during "Measurement Period"

define "Rotavirus 2 Dose Immunizations or Procedures":
	( [Immunization: "Rotavirus Vaccine (2 dose schedule)"]
		union [Procedure: "Rotavirus Vaccine (2 dose schedule) Administered"] ) TwoDoseRotavirus
			where AgeInDaysAt(Coalesce(TwoDoseRotavirus.performed.start, TwoDoseRotavirus.occurrence))>= 42
			and AgeInDaysAt(Coalesce(TwoDoseRotavirus.performed.start, TwoDoseRotavirus.occurrence))<= 730

define "Rotavirus 2 Dose Vaccinations":
	from
		"Rotavirus 2 Dose Immunizations or Procedures" Vaccination1,
		"Rotavirus 2 Dose Immunizations or Procedures" Vaccination2
		where Coalesce(Vaccination2.performed.start, Vaccination2.occurrence) 1 day or more after Coalesce(Vaccination1.performed.start, Vaccination1.occurrence)		
		return Vaccination1

define "Rotavirus 2 or 3 Dose Vaccinations":
	( "Rotavirus 2 or 3 Dose Vaccinations A"
			union "Rotavirus 2 or 3 Dose Vaccinations B"
			union "Rotavirus 2 or 3 Dose Vaccinations C"
	)

define "Rotavirus 2 or 3 Dose Vaccinations A":
	from
		"Rotavirus 2 Dose Immunizations or Procedures" Vaccination1,
		"Rotavirus 3 Dose Immunizations or Procedures" Vaccination2,
		"Rotavirus 3 Dose Immunizations or Procedures" Vaccination3
		where Coalesce(Vaccination2.performed.start, Vaccination2.occurrence) 1 day or more after Coalesce(Vaccination1.performed.start, Vaccination1.occurrence)
			and Coalesce(Vaccination3.performed.start, Vaccination3.occurrence) 1 day or more after Coalesce(Vaccination2.performed.start, Vaccination2.occurrence) 
		return Vaccination1

define "Rotavirus 2 or 3 Dose Vaccinations B":
	from
		"Rotavirus 3 Dose Immunizations or Procedures" Vaccination1,
		"Rotavirus 2 Dose Immunizations or Procedures" Vaccination2,
		"Rotavirus 3 Dose Immunizations or Procedures" Vaccination3
		where Coalesce(Vaccination2.performed.start, Vaccination2.occurrence) 1 day or more after Coalesce(Vaccination1.performed.start, Vaccination1.occurrence)
			and Coalesce(Vaccination3.performed.start, Vaccination3.occurrence) 1 day or more after Coalesce(Vaccination2.performed.start, Vaccination2.occurrence) 
		return Vaccination1

define "Rotavirus 2 or 3 Dose Vaccinations C":
	from
		"Rotavirus 3 Dose Immunizations or Procedures" Vaccination1,
		"Rotavirus 3 Dose Immunizations or Procedures" Vaccination2,
		"Rotavirus 2 Dose Immunizations or Procedures" Vaccination3
		where Coalesce(Vaccination2.performed.start, Vaccination2.occurrence) 1 day or more after Coalesce(Vaccination1.performed.start, Vaccination1.occurrence)
			and Coalesce(Vaccination3.performed.start, Vaccination3.occurrence) 1 day or more after Coalesce(Vaccination2.performed.start, Vaccination2.occurrence) 
		return Vaccination1

define "Rotavirus 3 Dose Immunizations or Procedures":
	( [Immunization: "Rotavirus Vaccine (3 dose schedule)"]
		union [Procedure: "Rotavirus Vaccine (3 dose schedule) Administered"] ) ThreeDoseRotavirus
		where AgeInDaysAt(Coalesce(ThreeDoseRotavirus.performed.start, ThreeDoseRotavirus.occurrence))>= 42
			and AgeInDaysAt(Coalesce(ThreeDoseRotavirus.performed.start, ThreeDoseRotavirus.occurrence))<= 730


define "Rotavirus 3 Dose Vaccinations":
	from
		"Rotavirus 3 Dose Immunizations or Procedures" Vaccination1,
		"Rotavirus 3 Dose Immunizations or Procedures" Vaccination2,
		"Rotavirus 3 Dose Immunizations or Procedures" Vaccination3
		where Coalesce(Vaccination2.performed.start, Vaccination2.occurrence) 1 day or more after Coalesce(Vaccination1.performed.start, Vaccination1.occurrence)
			and Coalesce(Vaccination3.performed.start, Vaccination3.occurrence) 1 day or more after Coalesce(Vaccination2.performed.start, Vaccination2.occurrence) 
		return Vaccination1

// define "Rotavirus Exclusions":
	// ( [Condition: "Anaphylactic Reaction to Rotavirus Vaccine"]
		// union [Condition: "Severe Combined Immunodeficiency"]
		// union [Condition: "Intussusception"] ) RotavirusConditions
		// where AgeInDaysAt(Coalesce(RotavirusConditions.onset.start, RotavirusConditions.onset))<= 730

define "Rotavirus Criteria Met":
	(exists( "Rotavirus 2 Dose Vaccinations" )
		or exists ( "Rotavirus 2 or 3 Dose Vaccinations" )
		or exists ( "Rotavirus 3 Dose Vaccinations" ))
			// and not exists( "Rotavirus Exclusions" )


define "Rubella Indicators":
	( ( [Observation: "Rubella Antibody Test (IgG Antibody Titer)"] Titer
			where Titer.value.value >= 1.10
	)
		union ( [Observation: "Rubella Antibody Test (IgG Antibody presence)"] IgGPresence
			with IgGPresence.value.coding coding such that exists(
							IgGPresence.value.coding coding
              	where coding.code in "Positive Finding"
        )
		)
		union ( [Condition: "Rubella"]
		) ) Rubella
		where AgeInDaysAt(Coalesce(Rubella.onset.start, Rubella.onset, Rubella.effective))<= 730

define "VZV Vaccinations":
	((([Immunization: "Varicella Zoster Vaccine (VZV)"]
		union [Procedure: "Varicella Zoster Vaccine (VZV) Administered"]) VZVVaccination
		where AgeInDaysAt(Coalesce(VZVVaccination.performed.start, VZVVaccination.occurrence)) >= 365
			and AgeInDaysAt(Coalesce(VZVVaccination.performed.start, VZVVaccination.occurrence)) <= 730
	)
	union ([Condition: "Varicella Zoster"] VZVCondition
		where AgeInDaysAt(Coalesce(VZVCondition.onset, VZVCondition.onset.start)) <= 730)) VZV
	return VZV

define "VZV Criteria Met":
	exists("VZV Vaccinations") // and not exists("MMR, VZV and Influenza Exclusions")

define "Numerator":
	case ( "Initial Population"
		and "DTaP Criteria Met"
		and "IPV Criteria Met"
		and "MMR Criteria Met"
		and "HIB Criteria Met"
		and "Hepatitis B Criteria Met"
		and "VZV Criteria Met"
		//and "Pneumococcal Conjugate Criteria Met"
		//and "Hepatitis A Criteria Met"
		//and "Rotavirus Criteria Met"
		//and "Influenza Criteria Met"
	)
		when true then 1
    else 0
  end

define "Denominator":
  case ("Initial Population" and not "Denominator Exclusions")
    when true then 1
    else 0
  end

define "Denominator Exclusions":
	exists ( [Encounter: "Encounter Inpatient"] DischargeHospice
			where ( ( DischargeHospice.hospitalization.dischargeDisposition in "Discharged to Home for Hospice Care"
						or DischargeHospice.hospitalization.dischargeDisposition in "Discharged to Health Care Facility for Hospice Care"
				)
					and DischargeHospice.period ends during "Measurement Period"
			)
	)
		or exists ( [ServiceRequest: "Hospice care ambulatory"]
		)
		or exists ( [ServiceRequest: "Hospice care ambulatory"] HospicePerformed
				where Coalesce(HospicePerformed.occurrence, HospicePerformed.occurrence.start) during "Measurement Period"
		)

context Unfiltered

define "Denominator Count":
  Sum("Denominator")

define "Numerator Count":
  Sum("Numerator")

define "CDC Measure Score":
  Sum("Numerator") / Sum("Denominator")