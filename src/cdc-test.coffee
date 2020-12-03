module.exports = {
   "library" : {
      "annotation" : [ {
         "translatorOptions" : "",
         "type" : "CqlToElmInfo"
      } ],
      "identifier" : {
         "id" : "CDC_HbA1c_test",
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
         }, {
            "name" : "Unfiltered"
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
            "name" : "InInitialPopulation",
            "context" : "Patient",
            "accessLevel" : "Public",
            "expression" : {
               "type" : "Case",
               "comparand" : {
                  "type" : "And",
                  "operand" : [ {
                     "type" : "GreaterOrEqual",
                     "operand" : [ {
                        "precision" : "Year",
                        "type" : "CalculateAgeAt",
                        "operand" : [ {
                           "type" : "ToDate",
                           "operand" : {
                              "path" : "birthDate",
                              "type" : "Property",
                              "source" : {
                                 "name" : "Patient",
                                 "type" : "ExpressionRef"
                              }
                           }
                        }, {
                           "type" : "Date",
                           "year" : {
                              "valueType" : "{urn:hl7-org:elm-types:r1}Integer",
                              "value" : "2013",
                              "type" : "Literal"
                           },
                           "month" : {
                              "valueType" : "{urn:hl7-org:elm-types:r1}Integer",
                              "value" : "1",
                              "type" : "Literal"
                           },
                           "day" : {
                              "valueType" : "{urn:hl7-org:elm-types:r1}Integer",
                              "value" : "1",
                              "type" : "Literal"
                           }
                        } ]
                     }, {
                        "valueType" : "{urn:hl7-org:elm-types:r1}Integer",
                        "value" : "0",
                        "type" : "Literal"
                     } ]
                  }, {
                     "type" : "Less",
                     "operand" : [ {
                        "precision" : "Year",
                        "type" : "CalculateAgeAt",
                        "operand" : [ {
                           "type" : "ToDate",
                           "operand" : {
                              "path" : "birthDate",
                              "type" : "Property",
                              "source" : {
                                 "name" : "Patient",
                                 "type" : "ExpressionRef"
                              }
                           }
                        }, {
                           "type" : "Date",
                           "year" : {
                              "valueType" : "{urn:hl7-org:elm-types:r1}Integer",
                              "value" : "2013",
                              "type" : "Literal"
                           },
                           "month" : {
                              "valueType" : "{urn:hl7-org:elm-types:r1}Integer",
                              "value" : "1",
                              "type" : "Literal"
                           },
                           "day" : {
                              "valueType" : "{urn:hl7-org:elm-types:r1}Integer",
                              "value" : "1",
                              "type" : "Literal"
                           }
                        } ]
                     }, {
                        "valueType" : "{urn:hl7-org:elm-types:r1}Integer",
                        "value" : "100",
                        "type" : "Literal"
                     } ]
                  } ]
               },
               "caseItem" : [ {
                  "when" : {
                     "valueType" : "{urn:hl7-org:elm-types:r1}Boolean",
                     "value" : "true",
                     "type" : "Literal"
                  },
                  "then" : {
                     "valueType" : "{urn:hl7-org:elm-types:r1}Integer",
                     "value" : "1",
                     "type" : "Literal"
                  }
               } ],
               "else" : {
                  "valueType" : "{urn:hl7-org:elm-types:r1}Integer",
                  "value" : "0",
                  "type" : "Literal"
               }
            }
         }, {
            "name" : "testInitialPopulation",
            "context" : "Patient",
            "accessLevel" : "Public",
            "expression" : {
               "type" : "And",
               "operand" : [ {
                  "type" : "GreaterOrEqual",
                  "operand" : [ {
                     "precision" : "Year",
                     "type" : "CalculateAgeAt",
                     "operand" : [ {
                        "type" : "ToDate",
                        "operand" : {
                           "path" : "birthDate",
                           "type" : "Property",
                           "source" : {
                              "name" : "Patient",
                              "type" : "ExpressionRef"
                           }
                        }
                     }, {
                        "type" : "Date",
                        "year" : {
                           "valueType" : "{urn:hl7-org:elm-types:r1}Integer",
                           "value" : "2013",
                           "type" : "Literal"
                        },
                        "month" : {
                           "valueType" : "{urn:hl7-org:elm-types:r1}Integer",
                           "value" : "1",
                           "type" : "Literal"
                        },
                        "day" : {
                           "valueType" : "{urn:hl7-org:elm-types:r1}Integer",
                           "value" : "1",
                           "type" : "Literal"
                        }
                     } ]
                  }, {
                     "valueType" : "{urn:hl7-org:elm-types:r1}Integer",
                     "value" : "0",
                     "type" : "Literal"
                  } ]
               }, {
                  "type" : "Less",
                  "operand" : [ {
                     "precision" : "Year",
                     "type" : "CalculateAgeAt",
                     "operand" : [ {
                        "type" : "ToDate",
                        "operand" : {
                           "path" : "birthDate",
                           "type" : "Property",
                           "source" : {
                              "name" : "Patient",
                              "type" : "ExpressionRef"
                           }
                        }
                     }, {
                        "type" : "Date",
                        "year" : {
                           "valueType" : "{urn:hl7-org:elm-types:r1}Integer",
                           "value" : "2013",
                           "type" : "Literal"
                        },
                        "month" : {
                           "valueType" : "{urn:hl7-org:elm-types:r1}Integer",
                           "value" : "1",
                           "type" : "Literal"
                        },
                        "day" : {
                           "valueType" : "{urn:hl7-org:elm-types:r1}Integer",
                           "value" : "1",
                           "type" : "Literal"
                        }
                     } ]
                  }, {
                     "valueType" : "{urn:hl7-org:elm-types:r1}Integer",
                     "value" : "100",
                     "type" : "Literal"
                  } ]
               } ]
            }
         }, {
            "name" : "test_true",
            "context" : "Patient",
            "accessLevel" : "Public",
            "expression" : {
               "valueType" : "{urn:hl7-org:elm-types:r1}Boolean",
               "value" : "true",
               "type" : "Literal"
            }
         }, {
            "name" : "test_false",
            "context" : "Patient",
            "accessLevel" : "Public",
            "expression" : {
               "valueType" : "{urn:hl7-org:elm-types:r1}Boolean",
               "value" : "false",
               "type" : "Literal"
            }
         }, {
            "name" : "test_tf",
            "context" : "Patient",
            "accessLevel" : "Public",
            "expression" : {
               "type" : "And",
               "operand" : [ {
                  "valueType" : "{urn:hl7-org:elm-types:r1}Boolean",
                  "value" : "true",
                  "type" : "Literal"
               }, {
                  "valueType" : "{urn:hl7-org:elm-types:r1}Boolean",
                  "value" : "false",
                  "type" : "Literal"
               } ]
            }
         }, {
            "name" : "test_tt",
            "context" : "Patient",
            "accessLevel" : "Public",
            "expression" : {
               "type" : "And",
               "operand" : [ {
                  "valueType" : "{urn:hl7-org:elm-types:r1}Boolean",
                  "value" : "true",
                  "type" : "Literal"
               }, {
                  "valueType" : "{urn:hl7-org:elm-types:r1}Boolean",
                  "value" : "true",
                  "type" : "Literal"
               } ]
            }
         }, {
            "name" : "test_ff",
            "context" : "Patient",
            "accessLevel" : "Public",
            "expression" : {
               "type" : "And",
               "operand" : [ {
                  "valueType" : "{urn:hl7-org:elm-types:r1}Boolean",
                  "value" : "false",
                  "type" : "Literal"
               }, {
                  "valueType" : "{urn:hl7-org:elm-types:r1}Boolean",
                  "value" : "false",
                  "type" : "Literal"
               } ]
            }
         }, {
            "name" : "test_test_true_Ininitialpopulation",
            "context" : "Patient",
            "accessLevel" : "Public",
            "expression" : {
               "type" : "And",
               "operand" : [ {
                  "name" : "testInitialPopulation",
                  "type" : "ExpressionRef"
               }, {
                  "valueType" : "{urn:hl7-org:elm-types:r1}Boolean",
                  "value" : "true",
                  "type" : "Literal"
               } ]
            }
         }, {
            "name" : "test_division",
            "context" : "Patient",
            "accessLevel" : "Public",
            "expression" : {
               "type" : "Divide",
               "operand" : [ {
                  "type" : "ToDecimal",
                  "operand" : {
                     "valueType" : "{urn:hl7-org:elm-types:r1}Integer",
                     "value" : "0",
                     "type" : "Literal"
                  }
               }, {
                  "type" : "ToDecimal",
                  "operand" : {
                     "valueType" : "{urn:hl7-org:elm-types:r1}Integer",
                     "value" : "1",
                     "type" : "Literal"
                  }
               } ]
            }
         }, {
            "name" : "test_division2",
            "context" : "Patient",
            "accessLevel" : "Public",
            "expression" : {
               "type" : "Divide",
               "operand" : [ {
                  "type" : "ToDecimal",
                  "operand" : {
                     "valueType" : "{urn:hl7-org:elm-types:r1}Integer",
                     "value" : "1",
                     "type" : "Literal"
                  }
               }, {
                  "type" : "ToDecimal",
                  "operand" : {
                     "valueType" : "{urn:hl7-org:elm-types:r1}Integer",
                     "value" : "0",
                     "type" : "Literal"
                  }
               } ]
            }
         }, {
            "name" : "InitialPopulationCount1",
            "context" : "Unfiltered",
            "accessLevel" : "Public",
            "expression" : {
               "type" : "Sum",
               "source" : {
                  "name" : "InInitialPopulation",
                  "type" : "ExpressionRef"
               }
            }
         } ]
      }
   }
}

