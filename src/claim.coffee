module.exports = {
   "library" : {
      "annotation" : [ {
         "translatorOptions" : "",
         "type" : "CqlToElmInfo"
      } ],
      "identifier" : {
         "id" : "AgeAtMP",
         "version" : "1"
      },
      "schemaIdentifier" : {
         "id" : "urn:hl7-org:elm",
         "version" : "r1"
      },
      "usings" : {
         "def" : [ {
            "localIdentifier" : "System",
            "uri" : "urn:hl7-org:elm-types:r1"
         }, {
            "localIdentifier" : "QUICK",
            "uri" : "http://hl7.org/fhir"
         } ]
      },
      "contexts" : {
         "def" : [ {
            "name" : "Patient"
         } ]
      },
      "statements" : {
         "def" : [ {
            "name" : "Patient",
            "context" : "Patient",
            "expression" : {
               "type" : "SingletonFrom",
               "operand" : {
                  "dataType" : "{http://hl7.org/fhir}Patient",
                  "templateId" : "patient-qicore-qicore-patient",
                  "type" : "Retrieve"
               }
            }
         }, {
            "name" : "DiagnosisIsDiabetes",
            "context" : "Patient",
            "accessLevel" : "Public",
            "expression" : {
               "type" : "Query",
               "source" : [ {
                  "alias" : "C",
                  "expression" : {
                     "dataType" : "{http://hl7.org/fhir}Claim",
                     "templateId" : "claim-qicore-qicore-claim",
                     "type" : "Retrieve"
                  }
               } ],
               "relationship" : [ {
                  "alias" : "diagnosis",
                  "type" : "With",
                  "expression" : {
                     "path" : "diagnosis",
                     "scope" : "C",
                     "type" : "Property"
                  },
                  "suchThat" : {
                     "type" : "Exists",
                     "operand" : {
                        "type" : "Query",
                        "source" : [ {
                           "alias" : "D",
                           "expression" : {
                              "path" : "diagnosis",
                              "scope" : "C",
                              "type" : "Property"
                           }
                        } ],
                        "relationship" : [ ],
                        "where" : {
                           "type" : "Equal",
                           "operand" : [ {
                              "path" : "code",
                              "type" : "Property",
                              "source" : {
                                 "path" : "diagnosis",
                                 "scope" : "D",
                                 "type" : "Property"
                              }
                           }, {
                              "valueType" : "{urn:hl7-org:elm-types:r1}String",
                              "value" : "Diabetes",
                              "type" : "Literal"
                           } ]
                        }
                     }
                  }
               } ]
            }
         } ]
      }
   }
}

