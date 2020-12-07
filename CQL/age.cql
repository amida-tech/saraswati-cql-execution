library AgeAtMP version '1'

using FHIR


context Patient

define "PatientExists":
  exists([Patient])
