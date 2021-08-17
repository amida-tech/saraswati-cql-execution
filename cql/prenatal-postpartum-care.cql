library Prenatal_Postpartum_Care version '1'

using FHIR version '4.0.0'
include FHIRHelpers version '4.0.0' called FHIRHelpers

valueset "Hospice": '2.16.840.1.113762.1.4.1182.2'
valueset "Deliveries": '2.16.840.1.113762.1.4.1078.3'
valueset "Non-live Births": '2.16.840.1.113762.1.4.1195.6'
valueset "Cervical Cytology Lab Test": '2.16.840.1.113883.3.464.1004.1525'
valueset "Cervical Cytology Result or Finding": '2.16.840.1.113883.3.464.1004.1524'
valueset "Postpartum Visits": '2.16.840.1.113762.1.4.1146.678'
valueset "Postpartum Bundled Services": '2.16.840.1.113762.1.4.1146.677'
valueset "Acute Inpatient": '2.16.840.1.113883.3.464.1003.101.12.1083'
valueset "Acute Inpatient POS": '2.16.840.1.113883.3.464.1003.101.11.1269'
valueset "Prenatal Bundled Services": '2.16.840.1.113883.3.464.1004.1223'
valueset "Stand Alone Prenatal Visits": '2.16.840.1.113883.3.464.1004.1240'
valueset "Prenatal Visits": '2.16.840.1.113883.3.464.1004.1225'
valueset "Pregnancy Diagnosis": '2.16.840.1.113762.1.4.1106.46'

 /* Valueset from HEDIS Spec. We ultimaly would like to use these 
 once we know how to extract them from the HEDIS book*/
// valueset "Hospice": '2.16.840.1.113883.3.464.1004.1418'
// valueset "Deliveries": '2.16.840.1.113883.3.464.1004.1072'
// valueset "Non-live Births": '2.16.840.1.113883.3.464.1004.1187'
// valueset "Cervical Cytology": '2.16.840.1.113883.3.464.1004.1208'
// valueset "Postpartum Visits": '2.16.840.1.113883.3.464.1004.1218'
// valueset "Postpartum Bundled Services": '2.16.840.1.113883.3.464.1004.1217'
// valueset "Acute Inpatient": '2.16.840.1.113883.3.464.1004.1810'
// valueset "Acute Inpatient POS": '2.16.840.1.113883.3.464.1004.1027'
// valueset "Prenatal Bundled Services": '2.16.840.1.113883.3.464.1004.1223'
// valueset "Stand Alone Prenatal Visits": '2.16.840.1.113883.3.464.1004.1240'
// valueset "Prenatal Visits": '2.16.840.1.113883.3.464.1004.1225'
// valueset "Pregnancy Diagnosis": '2.16.840.1.113883.3.464.1004.1220'


parameter "Measurement Period" default Interval[@2020-01-01T00:00:00.0, @2020-12-31T23:59:59.999)
parameter "Measurement Period Extended" default Interval[@2019-01-01T00:00:00.0, @2020-12-31T23:59:59.999)

context Patient

// Anchor Date
define "Anchor Date":
	"Event/diagnosis - Step 1" Proc where Proc.status.value = 'completed'
	return Proc.performed.end.value

// Event/diagnosis
define "Event/diagnosis - Step 1":
  [Procedure: "Deliveries"] delivery where  Patient.gender ~ 'female'
  and delivery.performed.end in Interval[@2019-10-08T00:00:00.0, @2020-10-07T23:59:59.999]

define "Event/diagnosis - Step 2":
    "Event/diagnosis - Step 1" del
    without [Condition: "Non-live Births"] cond such that exists(del)

define "Event/diagnosis - Step 3":
	"Event/diagnosis - Step 2" P where P.status.value = 'completed'
	and "Is Continuously Enrolled In Period"(Interval[P.performed.end.value - 43 days, P.performed.end.value + 60 days), 0)

// Timeliness of Prenatal Care
define "Prenatal Visits Procedures":
	[Procedure: "Prenatal Bundled Services"] P where P.status.value = 'completed' 
	and exists(P.performed.end)

define "Prenatal Visits Encounters":
	[Encounter: "Stand Alone Prenatal Visits"]
	union ([Encounter: "Prenatal Visits"] E with [Condition: "Pregnancy Diagnosis"] C such that exists(C))

define "Prenatal Care - Step 1 and 3":
	from "Anchor Date" D,
	Patient P with [Coverage] C such that P.gender ~ 'female' 
	and C.period starts during Interval[D - 280 days, D - 219 days] 
	and exists("Prenatal Visits Encounters" E where E.period starts during Interval[D - 280 days, D - 176 days])
	and exists("Prenatal Visits Procedures" Proc where Proc.performed.start during Interval[D - 280 days, D - 176 days])

define "Prenatal Care - Step 2 and 3":
	from "Anchor Date" D,
	Patient P with [Coverage] C such that P.gender ~ 'female'
	and ((days between C.period.start.value and D) > 219)
	and exists("Prenatal Visits Procedures" Proc where Proc.performed.start during Interval[D - 280 days, C.period.start.value + 42 days] 
	and Proc.performed.start.value !~ D)
	and exists("Prenatal Visits Encounters" E where E.period starts during Interval[D - 280 days, C.period.start.value + 42 days] 
	and E.period.start.value !~ D)
	

// Postpartum Care
define "Postpartum Care Criteria":
    ([Encounter: "Postpartum Visits"] E  with "Anchor Date" D such that E.period starts during Interval[D+ 7 days, D + 84 days])
    union [Procedure: "Cervical Cytology Lab Test"]
	union [Observation: "Cervical Cytology Result or Finding"]
    union ([Procedure: "Postpartum Bundled Services"] P where P.status.value = 'completed' and exists(P.performed.end)) Enc
	without "Postpartum Care Exclusion" Exclusion such that exists(Enc)

define "Postpartum Care Exclusion":
	[Encounter: "Acute Inpatient"] union [Encounter: "Acute Inpatient POS"]

// Denominator
define "Denominator":
	case (exists("Event/diagnosis - Step 3")) 
		when true then 1 else 0 
	end

// Numerator
define "Numerator":
	case (("Denominator" = 1) and exists("Prenatal Care - Step 1 and 3") and exists("Prenatal Care - Step 2 and 3"))
		when true then 1 else 0
	end

// Helper Functions
/*
Returns the periods during which the patient had coverage during the given participation period	
*/
define function "Coverage In Period"(CoveragePeriod Interval<DateTime>):
	collapse (
		[Coverage] P
			let I: P.period intersect CoveragePeriod where P.period overlaps CoveragePeriod
			return all Interval[ToDate(start of I), predecessor of (ToDate(end of I) + 1 day)]
	)

/*
Returns the number of gap days in the given coverage periods, allowing only one gap.
If there is more than one gap, returns the maximum Integer
*/
define function "Gap Days In Period"(CoveragePeriod Interval<DateTime>, Periods List<Interval<DateTime>>):
		case Count(Periods)
			when 1 then
			  if Periods[0] starts day of CoveragePeriod then
				  difference in days between end of Periods[0] and end of CoveragePeriod
			  else if Periods[0] ends day of CoveragePeriod then
				  difference in days between start of CoveragePeriod and start of Periods[0]
			  else 
				  maximum Integer
			when 2 then
			  if Periods[0] starts day of CoveragePeriod and Periods[1] ends day of CoveragePeriod then
				  difference in days between end of Periods[0] and start of Periods[1]
			  else
				  maximum Integer
			else
			  maximum Integer
		end

define function "Is Continuously Enrolled In Period"(EnrollmentPeriod Interval<DateTime>, AllowedGapDays Integer):
	"Gap Days In Period"(EnrollmentPeriod, "Coverage In Period"(EnrollmentPeriod)) <= AllowedGapDays