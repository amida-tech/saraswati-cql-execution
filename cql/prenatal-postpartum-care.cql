library Prenatal_Postpartum_Care version '1'

using FHIR version '4.0.0'
include FHIRHelpers version '4.0.0' called FHIRHelpers

valueset "Hospice": '2.16.840.1.113762.1.4.1182.2'
valueset "Deliveries": '2.16.840.1.113762.1.4.1078.3'
valueset "Non-live Births": '2.16.840.1.113762.1.4.1195.6'
valueset "Cervical Cytology": '2.16.840.1.113883.3.464.1003.111.12.1006'
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

define "End of Delivery":
    "Event/diagnosis - Step 1" P
    return P.performed.end

define "Event/diagnosis - Step 1":
  [Procedure: "Deliveries"] delivery
  where  Patient.gender ~ 'female' and
  delivery.performed.start in Interval[@2019-10-08T00:00:00.0, @2020-10-07T23:59:59.999)

define "Event/diagnosis - Step 2":
    "Event/diagnosis - Step 1" del
    without [Condition: "Non-live Births"] cond
    such that exists(cond)


// Prenatal Care
define "Prenatal Care - Step 3":
    [Encounter: "Stand Alone Prenatal Visits"]
    union [Procedure: "Prenatal Bundled Services"]
    union ([Encounter: "Prenatal Visits"] E with [Condition: "Pregnancy Diagnosis"] C such that exists(C))

// Postpartum Care
define "Postpartum Care Criteria":
    ([Encounter: "Postpartum Visits"]
    union [Observation: "Cervical Cytology"]
    union [Procedure: "Postpartum Bundled Services"]) E 
    where Coalesce(E.performed.start, E.effective.value, E.period.start) between 7 and 84 days after "End of Delivery"

define "Numerator Exclusion":
    [Encounter: "Acute Inpatient"] union [Encounter: "Acute Inpatient POS"]

define "Postpartum Care Numerator":
    exists("Postpartum Care Criteria")
    and not ("Numerator Exclusion")
