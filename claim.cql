library AgeAtMP version '1'

using QUICK

context Patient

define "DiagnosisIsDiabetes":
  [Claim] C
    with C.diagnosis diagnosis such that exists (
        C.diagnosis D
          where D.diagnosis.code = 'Diabetes'
      )





