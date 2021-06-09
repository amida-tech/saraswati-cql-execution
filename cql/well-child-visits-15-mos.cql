library well_child_visits_w15 version '1'

using FHIR version '4.0.0'
include FHIRHelpers version '4.0.0' called FHIRHelpers



valueset "Well-Care": '2.16.840.1.113883.3.464.1004.1262'
valueset "Telehealth Modifier": '2.16.840.1.113762.1.4.1138.731'
valueset "Telehealth POS": '2.16.840.1.113883.3.464.1003.101.11.1155'
valueset "Telephone Visits": '2.16.840.1.113883.3.1444.5.216'
valueset "Primary Care Provider": '2.16.840.1.113762.1.4.1182.375'

parameter "Measurement Period" default Interval[@2020-01-01T00:00:00.0, @2020-12-31T23:59:59.999)

context Patient

define "Initial Population":
	AgeInMonthsAt(start of "Measurement Period")>= 0
	and AgeInMonthsAt(end of "Measurement Period")=< 15

define "Number of Visits"
	//Evaluate list of visits
		//check each element returns 'valid'
	//will end up being Count [list variable]

define "Well-Care before patient 15mo birthday"
	[Encounter: "Well-Care"] E0
    where AgeInMonthsAt(E0.period.end) > 15 E1
      such that exists(E1)

define "Well-Care Without Duplicate Days"
	[Encounter: "Well-Care"] E0
	//Filter out duplicates in the day column

define "Encounter Dates"
	[Encounter: "Well-Care"] E0
  return Tuple {dateOfEncounter: E0.period.end}


define "Well-Care Encounter Without Telehealth":
  [Encounter: "Well-Care"] E0
    without [Encounter: "Telehealth Modifier"] E1
      such that exists(E1)
    without [Encounter: "Telehealth POS"] E2
      such that exists(E2)

define "Well-Care With PCP Code":
  [Encounter: "Well-Care"] E0
    without [Encounter: "Primary Care Provider"] E1
      such that exists(E1)

define "Valid Visit"
	[Encounter: "Well-Care"] E0
	case
		when "Well-Care before patient 15mo birthday" = false then false
		when "Well-Care Encounter Without Telehealth" = false then false
		when "Well-Care With PCP Code" = false then false
		when "Well-Care without Duplicate Days" = false then false
		else true
	end

	//Need more numerators here with relevant criteria
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

//Duplicate these two a bunch of times
define "Numerator Count":
  Sum("Numerator")

define "CDC Measure Score":
  Sum("Numerator") / Sum("Denominator")