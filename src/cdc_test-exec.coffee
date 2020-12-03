cql = require './cql'
measure = require './cdc-test'
codes = require './cql-code-service'

cservice = new codes.CodeService {
    "2.16.840.1.113883.3.464.1004.1810": {
        "Acute Inpatient": [
            {
            "code": "2421000175108",
            "system": "http://snomed.info/sct",
            "version": "2020-09"
            }
      ]
    },
    "2.16.840.1.113883.3.464.1004.1202":{
        "Outpatient": [
            {
                "code": "7271000175108",
                "system": "http://snomed.info/sct",
                "version": "2020-09"
            }
        ]
    },
    "2.16.840.1.113883.3.464.1004.1086": {
        "ED": [
            {
                "code": "4525004",
                "system": "http://snomed.info/sct",
                "version": "2020-09"
            }
        ]
    },
    "2.16.840.1.113883.3.464.1004.1191":{
        "Observation": [
            {
                "code": "0000000000",
                "system": "http://snomed.info/sct",
                "version": "2020-09"
            }
        ]
    },
    "2.16.840.1.113883.3.464.1004.1398":{
        "Nonacute Inpatient Stay": [
            {
                "code": "0000000000",
                "system": "http://snomed.info/sct",
                "version": "2020-09"
            }
        ]
    },
    "2.16.840.1.113883.3.464.1004.1246":{
        "Telephone Visits": [
            {
                "code": "0000000000",
                "system": "http://snomed.info/sct",
                "version": "2020-09"
            }
        ]
    },
    "2.16.840.1.113883.3.464.1004.1446":{
        "Online Assessments": [
            {
                "code": "0000000000",
                "system": "http://snomed.info/sct",
                "version": "2020-09"
            }
        ]
    },
    "2.16.840.1.113883.3.464.1004.1189":{
        "Nonacute Inpatient": [
            {
                "code": "0000000000",
                "system": "http://snomed.info/sct",
                "version": "2020-09"
            }
        ]
    },
    "2.16.840.1.113883.3.464.1004.1115":{
        "HbA1c Level Less Than 7.0": [
            {
                "code": "0000000000",
                "system": "http://snomed.info/sct",
                "version": "2020-09"
            }
        ]
    },
    "2.16.840.1.113883.3.464.1004.1976":{
        "HbA1c Level Greater Than or Equal to 7.0 and Less Than 8.0": [
            {
                "code": "0000000000",
                "system": "http://snomed.info/sct",
                "version": "2020-09"
            }
        ]
    },
    "2.16.840.1.113883.3.464.1004.1761":{
        "Hospice Encounter": [
            {
                "code": "0000000000",
                "system": "http://snomed.info/sct",
                "version": "2020-09"
            }
        ]
    },
    "2.16.840.1.113883.3.464.1004.1762":{
        "Hospice Intervention": [
            {
                "code": "0000000000",
                "system": "http://snomed.info/sct",
                "version": "2020-09"
            }
        ]
    },
    "2.16.840.1.113883.3.464.1004.1077": {
        "Diabetes": [
            {
                "code": "73211009",
                "system": "http://snomed.info/sct",
                "version": "2020-09"
            }
        ]
    },
    "2.16.840.1.113883.3.464.1004.1755":{
        "HbA1c Lab Test": [
            {
                "code": "0000000000",
                "system": "http://snomed.info/sct",
                "version": "2020-09"
            }
        ]
    },
    "2.16.840.1.113883.3.464.1004.1445":{
        "Telehealth Modifier": [
            {
                "code": "0000000000",
                "system": "http://snomed.info/sct",
                "version": "2020-09"
            }
        ]
    },
    "2.16.840.1.113883.3.464.1004.1460":{
        "Telehealth POS": [
            {
                "code": "0000000000",
                "system": "http://snomed.info/sct",
                "version": "2020-09"
            }
        ]
    },
    "2.16.840.1.113883.3.464.1004.1530":{
        "Frailty Device": [
            {
                "code": "0000000000",
                "system": "http://snomed.info/sct",
                "version": "2020-09"
            }
        ]
    },
    "2.16.840.1.113883.3.464.1004.1531":{
        "Frailty Diagnosis": [
            {
                "code": "0000000000",
                "system": "http://snomed.info/sct",
                "version": "2020-09"
            }
        ]
    },
    "2.16.840.1.113883.3.464.1004.1532":{
        "Frailty Encounter": [
            {
                "code": "0000000000",
                "system": "http://snomed.info/sct",
                "version": "2020-09"
            }
        ]
    },
    "2.16.840.1.113883.3.464.1004.1533":{
        "Frailty Symptom": [
            {
                "code": "0000000000",
                "system": "http://snomed.info/sct",
                "version": "2020-09"
            }
        ]
    },
    "2.16.840.1.113883.3.464.1004.1465":{
        "Advanced Illness": [
            {
                "code": "0000000000",
                "system": "http://snomed.info/sct",
                "version": "2020-09"
            }
        ]
    },
    "2.16.840.1.113883.3.464.1004.1395":{
        "Inpatient Stay": [
            {
                "code": "0000000000",
                "system": "http://snomed.info/sct",
                "version": "2020-09"
            }
        ]
    }
}



lib = new cql.Library(measure)

executor = new cql.Executor(lib, cservice)

psource = new cql.PatientSource [{

    "resourceType": "Bundle",
    "id": "example1",
    "meta": {
      "versionId": "1",
      "lastUpdated": "2014-08-18T01:43:30Z"
    },
    "base": "http://example.com/base",
    "entry" : [{
        "fullUrl": "urn:uuid:40d2066e-9037-763e-2bb3-c7e4b20a79d9",
        "request": {
        "method": "POST",
        "url": "Patient"
         }
        "resource": {
        "id" : "2",
        "meta" :{ "profile" : ["patient-qicore-qicore-patient"]},
        "resourceType" : "Patient",
        "text":{ "status":"generated", "div":"<div xmlns=\"http://www.w3.org/1999/xhtml\">Generated by <a href=\"https://github.com/synthetichealth/synthea\">Synthea</a>.Version identifier: master-branch-latest\n .   Person seed: 5953585832767524024  Population seed: 1601550514946</div>"},
        "extension":[
         {
            "url":"http://hl7.org/fhir/StructureDefinition/patient-mothersMaidenName",
            "valueString":"Becky854 Torphy630"
         },
         {
            "url":"http://hl7.org/fhir/StructureDefinition/patient-birthPlace",
            "valueAddress":{
               "city":"Pembroke",
               "state":"Massachusetts",
               "country":"US"
            }
         },
         {
            "url":"http://synthetichealth.github.io/synthea/disability-adjusted-life-years",
            "valueDecimal":0.0
         },
         {
            "url":"http://synthetichealth.github.io/synthea/quality-adjusted-life-years",
            "valueDecimal":11.0
         }
        ],
        "telecom":[
         {
            "system":"phone",
            "value":"555-184-3525",
            "use":"home"
         }
        ],
        "address":[
         {
            "extension":[
               {
                  "url":"http://hl7.org/fhir/StructureDefinition/geolocation",
                  "extension":[
                     {
                        "url":"latitude",
                        "valueDecimal":42.821342831436255
                     },
                     {
                        "url":"longitude",
                        "valueDecimal":-70.87362195510998
                     }
                  ]
               }
            ],
            "line":[
               "663 Hartmann Highlands Apt 42"
            ],
            "city":"Newburyport",
            "state":"Massachusetts",
            "postalCode":"01950",
            "country":"US"
         }
        ],
        "maritalStatus":{
         "coding":[
            {
               "system":"http://terminology.hl7.org/CodeSystem/v3-MaritalStatus",
               "code":"S",
               "display":"Never Married"
            }
         ],
         "text":"Never Married"
        },
        "multipleBirthBoolean":false,
        "communication":[
         {
            "language":{
               "coding":[
                  {
                     "system":"urn:ietf:bcp:47",
                     "code":"en-US",
                     "display":"English"
                  }
               ],
               "text":"English"
            }
         }
         ],
        "identifier": [{ "value": "2" }],
        "name": {"given":["Sally"], "family": ["Smith"]},
        "gender": "F",
        "birthDate" : "1950-08-02T11:47"}},
        {
          "resource": {
            "resourceType": "Condition",
            "meta": {
              "profile": ["condition-qicore-qicore-condition"]
            },
            "id": "conditionID",
            "clinicalStatus": {
              "coding": [
                {
                  "system": "http://terminology.hl7.org/CodeSystem/condition-clinical",
                  "code": "active"
                }
              ]
            },
            "verificationStatus": {
              "coding": [
                {
                  "system": "http://terminology.hl7.org/CodeSystem/condition-ver-status",
                  "code": "confirmed"
                }
              ]
            },
            "code": {
              "coding": [
                {
                  "system": "2.16.840.1.113883.6.96",
                  "code": "17741008",
                  "display": "Tonsilitis"
                }
              ],
              "text": "Tonsilitis"
            },
            "subject": {
              "reference": "40d2066e-9037-763e-2bb3-c7e4b20a79d9"
            }
          }
        }
        ]
},
{
  "resourceType": "Bundle",
  "type": "transaction",
  "entry": [
    {
      "fullUrl": "urn:uuid:40d2066e-9037-763e-2bb3-c7e4b20a79d9",
      "resource": {
        "resourceType": "Patient",
        "id": "40d2066e-9037-763e-2bb3-c7e4b20a79d9",
        "meta" :{ "profile" : ["patient-qicore-qicore-patient"]},
        "text": {
          "status": "generated",
          "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\">Generated by <a href=\"https://github.com/synthetichealth/synthea\">Synthea</a>.Version identifier: master-branch-latest\n .   Person seed: 5953585832767524024  Population seed: 1601550514946</div>"
        },
        "extension": [
          {
            "url": "http://hl7.org/fhir/StructureDefinition/patient-mothersMaidenName",
            "valueString": "Becky854 Torphy630"
          },
          {
            "url": "http://hl7.org/fhir/StructureDefinition/patient-birthPlace",
            "valueAddress": {
              "city": "Pembroke",
              "state": "Massachusetts",
              "country": "US"
            }
          },
          {
            "url": "http://synthetichealth.github.io/synthea/disability-adjusted-life-years",
            "valueDecimal": 0.0
          },
          {
            "url": "http://synthetichealth.github.io/synthea/quality-adjusted-life-years",
            "valueDecimal": 11.0
          }
        ],
        "identifier": [
          {
            "system": "https://github.com/synthetichealth/synthea",
            "value": "40d2066e-9037-763e-2bb3-c7e4b20a79d9"
          },
          {
            "type": {
              "coding": [
                {
                  "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
                  "code": "MR",
                  "display": "Medical Record Number"
                }
              ],
              "text": "Medical Record Number"
            },
            "system": "http://hospital.smarthealthit.org",
            "value": "40d2066e-9037-763e-2bb3-c7e4b20a79d9"
          },
          {
            "type": {
              "coding": [
                {
                  "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
                  "code": "SS",
                  "display": "Social Security Number"
                }
              ],
              "text": "Social Security Number"
            },
            "system": "http://hl7.org/fhir/sid/us-ssn",
            "value": "999-96-4590"
          }
        ],
        "name": [
          {
            "use": "official",
            "family": "Kunze215",
            "given": [
              "Alberto639"
            ]
          }
        ],
        "telecom": [
          {
            "system": "phone",
            "value": "555-184-3525",
            "use": "home"
          }
        ],
        "gender": "male",
        "birthDate": "2009-01-05",
        "address": [
          {
            "extension": [
              {
                "url": "http://hl7.org/fhir/StructureDefinition/geolocation",
                "extension": [
                  {
                    "url": "latitude",
                    "valueDecimal": 42.821342831436255
                  },
                  {
                    "url": "longitude",
                    "valueDecimal": -70.87362195510998
                  }
                ]
              }
            ],
            "line": [
              "663 Hartmann Highlands Apt 42"
            ],
            "city": "Newburyport",
            "state": "Massachusetts",
            "postalCode": "01950",
            "country": "US"
          }
        ],
        "maritalStatus": {
          "coding": [
            {
              "system": "http://terminology.hl7.org/CodeSystem/v3-MaritalStatus",
              "code": "S",
              "display": "Never Married"
            }
          ],
          "text": "Never Married"
        },
        "multipleBirthBoolean": false,
        "communication": [
          {
            "language": {
              "coding": [
                {
                  "system": "urn:ietf:bcp:47",
                  "code": "en-US",
                  "display": "English"
                }
              ],
              "text": "English"
            }
          }
        ]
      },
      "request": {
        "method": "POST",
        "url": "Patient"
      }
    }]
    }]

result = executor.exec(psource)

console.log("done")
console.log(result)