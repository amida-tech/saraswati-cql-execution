library well_child_visits_w15 version '1'

using FHIR version '4.0.0'
include FHIRHelpers version '4.0.0' called FHIRHelpers

codesystem "LOINC": 'http://loinc.org'
codesystem "SNOMED": 'http://snomed.info/sct'
codesystem "CQFramework": 'http://cqframework.info/codesystem/placeholder'


valueset "Well-Care": '2.16.840.1.113883.3.464.1004.1262'
valueset "Telehealth Modifier": '2.16.840.1.113762.1.4.1138.731'
valueset "Telehealth POS": '2.16.840.1.113883.3.464.1003.101.11.1155'
valueset "Telephone Visits": '2.16.840.1.113883.3.1444.5.216'

parameter "Measurement Period" default Interval[@2020-01-01T00:00:00.0, @2020-12-31T23:59:59.999)

//Data Presumptions-
//The data must include a generalPractitioner Field in the data, or it will return nothing.

context Patient

define "Initial Population":
AgeInYearsAt(start of "Measurement Period") < 1 
and AgeInMonthsAt(end of "Measurement Period") >= 15

define "Well-Care before patient 15mo birthday":
	[Encounter: "Well-Care"] E0
    where AgeInMonthsAt(E0.period.end) <= 15

define "Well-Care Without Duplicate Days":
	//MUST BE DeduplicateBasedOnStartDate when called to eval
	[Encounter: "Well-Care"] E0 sort by start of period

define "Well-Care Encounter Without Telehealth":
  [Encounter: "Well-Care"] E0
    without [Encounter: "Telehealth Modifier"] E1
      such that exists(E1)
    without [Encounter: "Telehealth POS"] E2
      such that exists(E2)

define "Patient Pcp":
  [Patient] P0
    with P0.generalPractitioner.reference P1
      such that exists(P1)

define "Well-Care With PCP Code":
  [Encounter: "Well-Care"] E0
    with "Patient Pcp" P1
      such that exists(P1)
    and E0.participant.individual.reference = P1.generalPractitioner.reference

define "Valid Visit Counter":
	Count(
		"Well-Care before patient 15mo birthday"
		intersect "Well-Care Encounter Without Telehealth"
		intersect "Well-Care With PCP Code"
		intersect DeduplicateBasedOnStartDate("Well-Care Without Duplicate Days")
		)

context Unfiltered
		
define "Numerator 0":
	case ( "Initial Population"
	and "Valid Visit Counter" = 0
	)
		when true then 1
    else 0
  end

define "Numerator 1":
	case ( "Initial Population"
	and "Valid Visit Counter" = 1
	)
		when true then 1
    else 0
  end

define "Numerator 2":
	case ( "Initial Population"
	and "Valid Visit Counter" = 2
	)
		when true then 1
    else 0
  end


define "Numerator 3":
	case ( "Initial Population"
	and "Valid Visit Counter" = 3
	)
		when true then 1
    else 0
  end

define "Numerator 4":
	case ( "Initial Population"
	and "Valid Visit Counter" = 4
	)
		when true then 1
    else 0
  end

define "Numerator 5":
	case ( "Initial Population"
	and "Valid Visit Counter" = 5
	)
		when true then 1
    else 0
  end

define "Numerator 6+":
	case ( "Initial Population"
	and "Valid Visit Counter" >= 6
	)
		when true then 1
    else 0
  end

define "Denominator":
  case ("Initial Population")
    when true then 1
    else 0
  end

define "Denominator Count":
  Sum("Denominator")

define "Numerator 0 Count":
  Sum("Numerator 0")

  define "Numerator 1 Count":
  Sum("Numerator 1")

  define "Numerator 2 Count":
  Sum("Numerator 2")

  define "Numerator 3 Count":
  Sum("Numerator 3")

  define "Numerator 4 Count":
  Sum("Numerator 4")

  define "Numerator 5 Count":
  Sum("Numerator 5")

  define "Numerator 6+ Count":
  Sum("Numerator 6+")

define "WCV15 0 Visits Measure Score":
  Sum("Numerator 0") / Sum("Denominator")

  define "WCV15 1 Visits Measure Score":
  Sum("Numerator 1") / Sum("Denominator")

  define "WCV15 2 Visits Measure Score":
  Sum("Numerator 2") / Sum("Denominator")

  define "WCV15 3 Visits Measure Score":
  Sum("Numerator 3") / Sum("Denominator")

  define "WCV15 4 Visits Measure Score":
  Sum("Numerator 4") / Sum("Denominator")

  define "WCV15 5 Visits Measure Score":
  Sum("Numerator 5") / Sum("Denominator")

  define "WCV15 6+ Visits Measure Score":
  Sum("Numerator 6+") / Sum("Denominator")

  define function DeduplicateBasedOnStartDate(Enc List<Encounter>):
  if Count(Enc) > 1 then 
    "Enc" N1
      with "Enc" N2
        such that (IndexOf("Enc", N2) + 1 = IndexOf("Enc", N1))
          and not (N1.period.start = N2.period.start)
  else Enc[0]