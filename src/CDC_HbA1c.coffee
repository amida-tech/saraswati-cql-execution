module.exports = {
   "library" : {
      "annotation" : [ {
         "translatorOptions" : "",
         "type" : "CqlToElmInfo"
      } ],
      "identifier" : {
         "id" : "CDC_HbA1c_lessthan8",
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
            "uri" : "http://hl7.org/fhir/us/qicore",
            "version" : "3.3.0"
         } ]
      },
      "parameters" : {
         "def" : [ {
            "name" : "MeasurementPeriod",
            "accessLevel" : "Public",
            "default" : {
               "lowClosed" : true,
               "highClosed" : false,
               "type" : "Interval",
               "low" : {
                  "type" : "DateTime",
                  "year" : {
                     "valueType" : "{urn:hl7-org:elm-types:r1}Integer",
                     "value" : "2018",
                     "type" : "Literal"
                  },
                  "month" : {
                     "valueType" : "{urn:hl7-org:elm-types:r1}Integer",
                     "value" : "12",
                     "type" : "Literal"
                  },
                  "day" : {
                     "valueType" : "{urn:hl7-org:elm-types:r1}Integer",
                     "value" : "31",
                     "type" : "Literal"
                  },
                  "hour" : {
                     "valueType" : "{urn:hl7-org:elm-types:r1}Integer",
                     "value" : "0",
                     "type" : "Literal"
                  },
                  "minute" : {
                     "valueType" : "{urn:hl7-org:elm-types:r1}Integer",
                     "value" : "0",
                     "type" : "Literal"
                  },
                  "second" : {
                     "valueType" : "{urn:hl7-org:elm-types:r1}Integer",
                     "value" : "0",
                     "type" : "Literal"
                  },
                  "millisecond" : {
                     "valueType" : "{urn:hl7-org:elm-types:r1}Integer",
                     "value" : "0",
                     "type" : "Literal"
                  }
               },
               "high" : {
                  "type" : "DateTime",
                  "year" : {
                     "valueType" : "{urn:hl7-org:elm-types:r1}Integer",
                     "value" : "2019",
                     "type" : "Literal"
                  },
                  "month" : {
                     "valueType" : "{urn:hl7-org:elm-types:r1}Integer",
                     "value" : "12",
                     "type" : "Literal"
                  },
                  "day" : {
                     "valueType" : "{urn:hl7-org:elm-types:r1}Integer",
                     "value" : "31",
                     "type" : "Literal"
                  },
                  "hour" : {
                     "valueType" : "{urn:hl7-org:elm-types:r1}Integer",
                     "value" : "0",
                     "type" : "Literal"
                  },
                  "minute" : {
                     "valueType" : "{urn:hl7-org:elm-types:r1}Integer",
                     "value" : "0",
                     "type" : "Literal"
                  },
                  "second" : {
                     "valueType" : "{urn:hl7-org:elm-types:r1}Integer",
                     "value" : "0",
                     "type" : "Literal"
                  },
                  "millisecond" : {
                     "valueType" : "{urn:hl7-org:elm-types:r1}Integer",
                     "value" : "0",
                     "type" : "Literal"
                  }
               }
            }
         } ]
      },
      "codeSystems" : {
         "def" : [ {
            "name" : "SNOMED-CT",
            "id" : "2.16.840.1.113883.6.96",
            "version" : "20200301",
            "accessLevel" : "Public"
         } ]
      },
      "valueSets" : {
         "def" : [ {
            "name" : "Acute Inpatient",
            "id" : "2.16.840.1.113762.1.4.1182.120",
            "accessLevel" : "Public"
         }, {
            "name" : "Outpatient",
            "id" : "2.16.840.1.113883.3.464.1003.101.12.1008",
            "accessLevel" : "Public"
         }, {
            "name" : "ED",
            "id" : "2.16.840.1.113883.3.464.1003.101.12.1085",
            "accessLevel" : "Public"
         }, {
            "name" : "Observation",
            "id" : "2.16.840.1.113762.1.4.1181.72",
            "accessLevel" : "Public"
         }, {
            "name" : "Nonacute Inpatient Stay",
            "id" : "2.16.840.1.113762.1.4.1182.289",
            "accessLevel" : "Public"
         }, {
            "name" : "Telephone Visits",
            "id" : "2.16.840.1.113883.3.1444.5.216",
            "accessLevel" : "Public"
         }, {
            "name" : "Online Assessments",
            "id" : "2.16.840.1.113883.3.7587.3.1013",
            "accessLevel" : "Public"
         }, {
            "name" : "Nonacute Inpatient",
            "id" : "2.16.840.1.113883.3.464.1003.101.12.1084",
            "accessLevel" : "Public"
         }, {
            "name" : "HbA1c Level Less Than 7.0",
            "id" : "2.16.840.1.113883.3.464.1003.198.11.1024",
            "accessLevel" : "Public"
         }, {
            "name" : "HbA1c Level Greater Than or Equal to 7.0 and Less Than 8.0",
            "id" : "2.16.840.1.113883.3.464.1003.198.11.1024",
            "accessLevel" : "Public"
         }, {
            "name" : "Hospice Encounter",
            "id" : "2.16.840.1.113762.1.4.1182.2",
            "accessLevel" : "Public"
         }, {
            "name" : "Hospice Intervention",
            "id" : "2.16.840.1.113762.1.4.1182.2",
            "accessLevel" : "Public"
         }, {
            "name" : "Diabetes",
            "id" : "2.16.840.1.113883.3.464.1003.103.12.1001",
            "accessLevel" : "Public"
         }, {
            "name" : "HbA1c Lab Test",
            "id" : "2.16.840.1.113883.3.464.1003.198.11.1024",
            "accessLevel" : "Public"
         }, {
            "name" : "Telehealth Modifier",
            "id" : "2.16.840.1.113762.1.4.1138.731",
            "accessLevel" : "Public"
         }, {
            "name" : "Telehealth POS",
            "id" : "2.16.840.1.113883.3.464.1003.101.11.1155",
            "accessLevel" : "Public"
         }, {
            "name" : "Frailty Device",
            "id" : "2.16.840.1.113883.3.464.1003.118.12.1300",
            "accessLevel" : "Public"
         }, {
            "name" : "Frailty Diagnosis",
            "id" : "2.16.840.1.113883.3.464.1003.113.11.1309",
            "accessLevel" : "Public"
         }, {
            "name" : "Frailty Encounter",
            "id" : "2.16.840.1.113883.3.464.1003.101.12.1088",
            "accessLevel" : "Public"
         }, {
            "name" : "Frailty Symptom",
            "id" : "2.16.840.1.113883.3.464.1003.113.12.1075",
            "accessLevel" : "Public"
         }, {
            "name" : "Advanced Illness",
            "id" : "2.16.840.1.113883.3.464.1003.110.12.1082",
            "accessLevel" : "Public"
         }, {
            "name" : "Inpatient Stay",
            "id" : "2.16.840.1.113762.1.4.1182.285",
            "accessLevel" : "Public"
         } ]
      },
      "codes" : {
         "def" : [ {
            "name" : "Acarbose_code",
            "id" : "386965004",
            "accessLevel" : "Public",
            "codeSystem" : {
               "name" : "SNOMED-CT"
            }
         }, {
            "name" : "Miglitol",
            "id" : "109071007",
            "accessLevel" : "Public",
            "codeSystem" : {
               "name" : "SNOMED-CT"
            }
         }, {
            "name" : "insulin aspart",
            "id" : "325072002",
            "accessLevel" : "Public",
            "codeSystem" : {
               "name" : "SNOMED-CT"
            }
         } ]
      },
      "concepts" : {
         "def" : [ {
            "name" : "diabetes medication",
            "display" : "diabetes medication",
            "accessLevel" : "Public",
            "code" : [ {
               "name" : "Acarbose_code"
            }, {
               "name" : "Miglitol"
            }, {
               "name" : "insulin aspart"
            } ]
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
                  "dataType" : "{http://hl7.org/fhir/us/qicore}Patient",
                  "templateId" : "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-patient",
                  "type" : "Retrieve"
               }
            }
         }, {
            "name" : "InitialPopulation",
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
                        "type" : "ToDateTime",
                        "operand" : {
                           "path" : "birthDate",
                           "type" : "Property",
                           "source" : {
                              "name" : "Patient",
                              "type" : "ExpressionRef"
                           }
                        }
                     }, {
                        "type" : "Start",
                        "operand" : {
                           "name" : "MeasurementPeriod",
                           "type" : "ParameterRef"
                        }
                     } ]
                  }, {
                     "valueType" : "{urn:hl7-org:elm-types:r1}Integer",
                     "value" : "18",
                     "type" : "Literal"
                  } ]
               }, {
                  "type" : "Less",
                  "operand" : [ {
                     "precision" : "Year",
                     "type" : "CalculateAgeAt",
                     "operand" : [ {
                        "type" : "ToDateTime",
                        "operand" : {
                           "path" : "birthDate",
                           "type" : "Property",
                           "source" : {
                              "name" : "Patient",
                              "type" : "ExpressionRef"
                           }
                        }
                     }, {
                        "type" : "Start",
                        "operand" : {
                           "name" : "MeasurementPeriod",
                           "type" : "ParameterRef"
                        }
                     } ]
                  }, {
                     "valueType" : "{urn:hl7-org:elm-types:r1}Integer",
                     "value" : "75",
                     "type" : "Literal"
                  } ]
               } ]
            }
         }, {
            "name" : "telehealth modifier",
            "context" : "Patient",
            "accessLevel" : "Public",
            "expression" : {
               "type" : "Exists",
               "operand" : {
                  "type" : "Query",
                  "source" : [ {
                     "alias" : "E",
                     "expression" : {
                        "dataType" : "{http://hl7.org/fhir/us/qicore}Encounter",
                        "templateId" : "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-encounter",
                        "codeProperty" : "type",
                        "codeComparator" : "in",
                        "type" : "Retrieve",
                        "codes" : {
                           "name" : "Telehealth Modifier",
                           "type" : "ValueSetRef"
                        }
                     }
                  } ],
                  "relationship" : [ ],
                  "where" : {
                     "type" : "In",
                     "operand" : [ {
                        "path" : "period",
                        "scope" : "E",
                        "type" : "Property"
                     }, {
                        "type" : "ToList",
                        "operand" : {
                           "name" : "MeasurementPeriod",
                           "type" : "ParameterRef"
                        }
                     } ]
                  }
               }
            }
         }, {
            "name" : "telehealth POS",
            "context" : "Patient",
            "accessLevel" : "Public",
            "expression" : {
               "type" : "Exists",
               "operand" : {
                  "type" : "Query",
                  "source" : [ {
                     "alias" : "E",
                     "expression" : {
                        "dataType" : "{http://hl7.org/fhir/us/qicore}Encounter",
                        "templateId" : "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-encounter",
                        "codeProperty" : "type",
                        "codeComparator" : "in",
                        "type" : "Retrieve",
                        "codes" : {
                           "name" : "Telehealth POS",
                           "type" : "ValueSetRef"
                        }
                     }
                  } ],
                  "relationship" : [ ],
                  "where" : {
                     "type" : "In",
                     "operand" : [ {
                        "path" : "period",
                        "scope" : "E",
                        "type" : "Property"
                     }, {
                        "type" : "ToList",
                        "operand" : {
                           "name" : "MeasurementPeriod",
                           "type" : "ParameterRef"
                        }
                     } ]
                  }
               }
            }
         }, {
            "name" : "acute inpatient encounter",
            "context" : "Patient",
            "accessLevel" : "Public",
            "expression" : {
               "type" : "Exists",
               "operand" : {
                  "type" : "Query",
                  "source" : [ {
                     "alias" : "E",
                     "expression" : {
                        "dataType" : "{http://hl7.org/fhir/us/qicore}Encounter",
                        "templateId" : "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-encounter",
                        "codeProperty" : "type",
                        "codeComparator" : "in",
                        "type" : "Retrieve",
                        "codes" : {
                           "name" : "Acute Inpatient",
                           "type" : "ValueSetRef"
                        }
                     }
                  } ],
                  "relationship" : [ {
                     "alias" : "D",
                     "type" : "With",
                     "expression" : {
                        "dataType" : "{http://hl7.org/fhir/us/qicore}Condition",
                        "templateId" : "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-condition",
                        "codeProperty" : "code",
                        "codeComparator" : "in",
                        "type" : "Retrieve",
                        "codes" : {
                           "name" : "Diabetes",
                           "type" : "ValueSetRef"
                        }
                     },
                     "suchThat" : {
                        "type" : "In",
                        "operand" : [ {
                           "path" : "period",
                           "scope" : "E",
                           "type" : "Property"
                        }, {
                           "type" : "ToList",
                           "operand" : {
                              "name" : "MeasurementPeriod",
                              "type" : "ParameterRef"
                           }
                        } ]
                     }
                  } ]
               }
            }
         }, {
            "name" : "acute inpatient encounter without telehealth",
            "context" : "Patient",
            "accessLevel" : "Public",
            "expression" : {
               "type" : "And",
               "operand" : [ {
                  "type" : "And",
                  "operand" : [ {
                     "name" : "acute inpatient encounter",
                     "type" : "ExpressionRef"
                  }, {
                     "type" : "Not",
                     "operand" : {
                        "name" : "telehealth POS",
                        "type" : "ExpressionRef"
                     }
                  } ]
               }, {
                  "type" : "Not",
                  "operand" : {
                     "name" : "telehealth modifier",
                     "type" : "ExpressionRef"
                  }
               } ]
            }
         }, {
            "name" : "acute inpatient discharge with diabetes",
            "context" : "Patient",
            "accessLevel" : "Public",
            "expression" : {
               "type" : "Query",
               "source" : [ {
                  "alias" : "Enc",
                  "expression" : {
                     "dataType" : "{http://hl7.org/fhir/us/qicore}Encounter",
                     "templateId" : "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-encounter",
                     "codeProperty" : "type",
                     "codeComparator" : "in",
                     "type" : "Retrieve",
                     "codes" : {
                        "name" : "Acute Inpatient",
                        "type" : "ValueSetRef"
                     }
                  }
               } ],
               "relationship" : [ {
                  "alias" : "Dia",
                  "type" : "With",
                  "expression" : {
                     "dataType" : "{http://hl7.org/fhir/us/qicore}Condition",
                     "templateId" : "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-condition",
                     "codeProperty" : "code",
                     "codeComparator" : "in",
                     "type" : "Retrieve",
                     "codes" : {
                        "name" : "Diabetes",
                        "type" : "ValueSetRef"
                     }
                  },
                  "suchThat" : {
                     "type" : "And",
                     "operand" : [ {
                        "type" : "Equal",
                        "operand" : [ {
                           "path" : "status",
                           "scope" : "Enc",
                           "type" : "Property"
                        }, {
                           "valueType" : "{urn:hl7-org:elm-types:r1}String",
                           "value" : "finished",
                           "type" : "Literal"
                        } ]
                     }, {
                        "type" : "In",
                        "operand" : [ {
                           "path" : "period",
                           "scope" : "Enc",
                           "type" : "Property"
                        }, {
                           "type" : "ToList",
                           "operand" : {
                              "name" : "MeasurementPeriod",
                              "type" : "ParameterRef"
                           }
                        } ]
                     } ]
                  }
               } ]
            }
         }, {
            "name" : "acute inpatient discharge on discharge claim",
            "context" : "Patient",
            "accessLevel" : "Public",
            "expression" : {
               "type" : "Exists",
               "operand" : {
                  "type" : "Query",
                  "source" : [ {
                     "alias" : "Enc",
                     "expression" : {
                        "name" : "acute inpatient discharge with diabetes",
                        "type" : "ExpressionRef"
                     }
                  } ],
                  "relationship" : [ {
                     "alias" : "AI",
                     "type" : "With",
                     "expression" : {
                        "dataType" : "{http://hl7.org/fhir/us/qicore}Claim",
                        "templateId" : "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-claim",
                        "codeProperty" : "type",
                        "codeComparator" : "in",
                        "type" : "Retrieve",
                        "codes" : {
                           "name" : "Acute Inpatient",
                           "type" : "ValueSetRef"
                        }
                     },
                     "suchThat" : {
                        "type" : "Equal",
                        "operand" : [ {
                           "path" : "subject",
                           "scope" : "Enc",
                           "type" : "Property"
                        }, {
                           "path" : "patient",
                           "scope" : "AI",
                           "type" : "Property"
                        } ]
                     }
                  } ]
               }
            }
         }, {
            "name" : "nonacute diabetes discharges",
            "context" : "Patient",
            "accessLevel" : "Public",
            "expression" : {
               "type" : "Query",
               "source" : [ {
                  "alias" : "E",
                  "expression" : {
                     "dataType" : "{http://hl7.org/fhir/us/qicore}Encounter",
                     "templateId" : "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-encounter",
                     "codeProperty" : "type",
                     "codeComparator" : "in",
                     "type" : "Retrieve",
                     "codes" : {
                        "name" : "Nonacute Inpatient Stay",
                        "type" : "ValueSetRef"
                     }
                  }
               } ],
               "relationship" : [ {
                  "alias" : "Dia",
                  "type" : "With",
                  "expression" : {
                     "dataType" : "{http://hl7.org/fhir/us/qicore}Condition",
                     "templateId" : "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-condition",
                     "codeProperty" : "code",
                     "codeComparator" : "in",
                     "type" : "Retrieve",
                     "codes" : {
                        "name" : "Diabetes",
                        "type" : "ValueSetRef"
                     }
                  },
                  "suchThat" : {
                     "type" : "Equivalent",
                     "operand" : [ {
                        "path" : "status",
                        "scope" : "E",
                        "type" : "Property"
                     }, {
                        "valueType" : "{urn:hl7-org:elm-types:r1}String",
                        "value" : "finished",
                        "type" : "Literal"
                     } ]
                  }
               } ]
            }
         }, {
            "name" : "nonacute diabetes discharges on claim",
            "context" : "Patient",
            "accessLevel" : "Public",
            "expression" : {
               "type" : "Query",
               "source" : [ {
                  "alias" : "E",
                  "expression" : {
                     "name" : "nonacute diabetes discharges",
                     "type" : "ExpressionRef"
                  }
               } ],
               "relationship" : [ {
                  "alias" : "C",
                  "type" : "With",
                  "expression" : {
                     "dataType" : "{http://hl7.org/fhir/us/qicore}Claim",
                     "templateId" : "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-claim",
                     "codeProperty" : "type",
                     "codeComparator" : "in",
                     "type" : "Retrieve",
                     "codes" : {
                        "name" : "Nonacute Inpatient Stay",
                        "type" : "ValueSetRef"
                     }
                  },
                  "suchThat" : {
                     "type" : "Equal",
                     "operand" : [ {
                        "path" : "subject",
                        "scope" : "E",
                        "type" : "Property"
                     }, {
                        "path" : "patient",
                        "scope" : "C",
                        "type" : "Property"
                     } ]
                  }
               } ]
            }
         }, {
            "name" : "diabetes test",
            "context" : "Patient",
            "accessLevel" : "Public",
            "expression" : {
               "type" : "Exists",
               "operand" : {
                  "dataType" : "{http://hl7.org/fhir/us/qicore}Condition",
                  "templateId" : "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-condition",
                  "codeProperty" : "code",
                  "codeComparator" : "in",
                  "type" : "Retrieve",
                  "codes" : {
                     "name" : "Diabetes",
                     "type" : "ValueSetRef"
                  }
               }
            }
         }, {
            "name" : "nonacute outpatient encounters with diabetes",
            "context" : "Patient",
            "accessLevel" : "Public",
            "expression" : {
               "type" : "GreaterOrEqual",
               "operand" : [ {
                  "type" : "Count",
                  "source" : {
                     "type" : "List",
                     "element" : [ {
                        "type" : "Exists",
                        "operand" : {
                           "type" : "Query",
                           "source" : [ {
                              "alias" : "E",
                              "expression" : {
                                 "dataType" : "{http://hl7.org/fhir/us/qicore}Encounter",
                                 "templateId" : "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-encounter",
                                 "codeProperty" : "type",
                                 "codeComparator" : "in",
                                 "type" : "Retrieve",
                                 "codes" : {
                                    "name" : "Outpatient",
                                    "type" : "ValueSetRef"
                                 }
                              }
                           } ],
                           "relationship" : [ {
                              "alias" : "dia",
                              "type" : "With",
                              "expression" : {
                                 "dataType" : "{http://hl7.org/fhir/us/qicore}Condition",
                                 "templateId" : "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-condition",
                                 "codeProperty" : "code",
                                 "codeComparator" : "in",
                                 "type" : "Retrieve",
                                 "codes" : {
                                    "name" : "Diabetes",
                                    "type" : "ValueSetRef"
                                 }
                              },
                              "suchThat" : {
                                 "type" : "Equal",
                                 "operand" : [ {
                                    "path" : "status",
                                    "scope" : "E",
                                    "type" : "Property"
                                 }, {
                                    "valueType" : "{urn:hl7-org:elm-types:r1}String",
                                    "value" : "finished",
                                    "type" : "Literal"
                                 } ]
                              }
                           } ]
                        }
                     }, {
                        "type" : "Exists",
                        "operand" : {
                           "type" : "Query",
                           "source" : [ {
                              "alias" : "F",
                              "expression" : {
                                 "dataType" : "{http://hl7.org/fhir/us/qicore}Encounter",
                                 "templateId" : "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-encounter",
                                 "codeProperty" : "type",
                                 "codeComparator" : "in",
                                 "type" : "Retrieve",
                                 "codes" : {
                                    "name" : "Observation",
                                    "type" : "ValueSetRef"
                                 }
                              }
                           } ],
                           "relationship" : [ {
                              "alias" : "dia",
                              "type" : "With",
                              "expression" : {
                                 "dataType" : "{http://hl7.org/fhir/us/qicore}Condition",
                                 "templateId" : "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-condition",
                                 "codeProperty" : "code",
                                 "codeComparator" : "in",
                                 "type" : "Retrieve",
                                 "codes" : {
                                    "name" : "Diabetes",
                                    "type" : "ValueSetRef"
                                 }
                              },
                              "suchThat" : {
                                 "type" : "Equal",
                                 "operand" : [ {
                                    "path" : "status",
                                    "scope" : "F",
                                    "type" : "Property"
                                 }, {
                                    "valueType" : "{urn:hl7-org:elm-types:r1}String",
                                    "value" : "finished",
                                    "type" : "Literal"
                                 } ]
                              }
                           } ]
                        }
                     }, {
                        "type" : "Exists",
                        "operand" : {
                           "type" : "Query",
                           "source" : [ {
                              "alias" : "G",
                              "expression" : {
                                 "dataType" : "{http://hl7.org/fhir/us/qicore}Encounter",
                                 "templateId" : "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-encounter",
                                 "codeProperty" : "type",
                                 "codeComparator" : "in",
                                 "type" : "Retrieve",
                                 "codes" : {
                                    "name" : "Telephone Visits",
                                    "type" : "ValueSetRef"
                                 }
                              }
                           } ],
                           "relationship" : [ {
                              "alias" : "dia",
                              "type" : "With",
                              "expression" : {
                                 "dataType" : "{http://hl7.org/fhir/us/qicore}Condition",
                                 "templateId" : "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-condition",
                                 "codeProperty" : "code",
                                 "codeComparator" : "in",
                                 "type" : "Retrieve",
                                 "codes" : {
                                    "name" : "Diabetes",
                                    "type" : "ValueSetRef"
                                 }
                              },
                              "suchThat" : {
                                 "type" : "Equal",
                                 "operand" : [ {
                                    "path" : "status",
                                    "scope" : "G",
                                    "type" : "Property"
                                 }, {
                                    "valueType" : "{urn:hl7-org:elm-types:r1}String",
                                    "value" : "finished",
                                    "type" : "Literal"
                                 } ]
                              }
                           } ]
                        }
                     }, {
                        "type" : "Exists",
                        "operand" : {
                           "type" : "Query",
                           "source" : [ {
                              "alias" : "H",
                              "expression" : {
                                 "dataType" : "{http://hl7.org/fhir/us/qicore}Encounter",
                                 "templateId" : "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-encounter",
                                 "codeProperty" : "type",
                                 "codeComparator" : "in",
                                 "type" : "Retrieve",
                                 "codes" : {
                                    "name" : "Online Assessments",
                                    "type" : "ValueSetRef"
                                 }
                              }
                           } ],
                           "relationship" : [ {
                              "alias" : "dia",
                              "type" : "With",
                              "expression" : {
                                 "dataType" : "{http://hl7.org/fhir/us/qicore}Condition",
                                 "templateId" : "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-condition",
                                 "codeProperty" : "code",
                                 "codeComparator" : "in",
                                 "type" : "Retrieve",
                                 "codes" : {
                                    "name" : "Diabetes",
                                    "type" : "ValueSetRef"
                                 }
                              },
                              "suchThat" : {
                                 "type" : "Equal",
                                 "operand" : [ {
                                    "path" : "status",
                                    "scope" : "H",
                                    "type" : "Property"
                                 }, {
                                    "valueType" : "{urn:hl7-org:elm-types:r1}String",
                                    "value" : "finished",
                                    "type" : "Literal"
                                 } ]
                              }
                           } ]
                        }
                     }, {
                        "type" : "Exists",
                        "operand" : {
                           "type" : "Query",
                           "source" : [ {
                              "alias" : "I",
                              "expression" : {
                                 "dataType" : "{http://hl7.org/fhir/us/qicore}Encounter",
                                 "templateId" : "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-encounter",
                                 "codeProperty" : "type",
                                 "codeComparator" : "in",
                                 "type" : "Retrieve",
                                 "codes" : {
                                    "name" : "ED",
                                    "type" : "ValueSetRef"
                                 }
                              }
                           } ],
                           "relationship" : [ {
                              "alias" : "dia",
                              "type" : "With",
                              "expression" : {
                                 "dataType" : "{http://hl7.org/fhir/us/qicore}Condition",
                                 "templateId" : "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-condition",
                                 "codeProperty" : "code",
                                 "codeComparator" : "in",
                                 "type" : "Retrieve",
                                 "codes" : {
                                    "name" : "Diabetes",
                                    "type" : "ValueSetRef"
                                 }
                              },
                              "suchThat" : {
                                 "type" : "Equal",
                                 "operand" : [ {
                                    "path" : "status",
                                    "scope" : "I",
                                    "type" : "Property"
                                 }, {
                                    "valueType" : "{urn:hl7-org:elm-types:r1}String",
                                    "value" : "finished",
                                    "type" : "Literal"
                                 } ]
                              }
                           } ]
                        }
                     } ]
                  }
               }, {
                  "valueType" : "{urn:hl7-org:elm-types:r1}Integer",
                  "value" : "2",
                  "type" : "Literal"
               } ]
            }
         }, {
            "name" : "diabetes diagnosis by medication",
            "context" : "Patient",
            "accessLevel" : "Public",
            "expression" : {
               "type" : "Or",
               "operand" : [ {
                  "type" : "Or",
                  "operand" : [ {
                     "type" : "Exists",
                     "operand" : {
                        "type" : "Query",
                        "source" : [ {
                           "alias" : "A",
                           "expression" : {
                              "dataType" : "{http://hl7.org/fhir/us/qicore}MedicationDispense",
                              "templateId" : "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-medicationdispense",
                              "type" : "Retrieve"
                           }
                        } ],
                        "relationship" : [ ],
                        "where" : {
                           "type" : "And",
                           "operand" : [ {
                              "type" : "Equal",
                              "operand" : [ {
                                 "asType" : "{urn:hl7-org:elm-types:r1}Concept",
                                 "type" : "As",
                                 "operand" : {
                                    "path" : "medication",
                                    "scope" : "A",
                                    "type" : "Property"
                                 }
                              }, {
                                 "type" : "ToConcept",
                                 "operand" : {
                                    "name" : "Acarbose_code",
                                    "type" : "CodeRef"
                                 }
                              } ]
                           }, {
                              "type" : "Equivalent",
                              "operand" : [ {
                                 "path" : "status",
                                 "scope" : "A",
                                 "type" : "Property"
                              }, {
                                 "valueType" : "{urn:hl7-org:elm-types:r1}String",
                                 "value" : "completed",
                                 "type" : "Literal"
                              } ]
                           } ]
                        }
                     }
                  }, {
                     "type" : "Exists",
                     "operand" : {
                        "type" : "Query",
                        "source" : [ {
                           "alias" : "B",
                           "expression" : {
                              "dataType" : "{http://hl7.org/fhir/us/qicore}MedicationDispense",
                              "templateId" : "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-medicationdispense",
                              "type" : "Retrieve"
                           }
                        } ],
                        "relationship" : [ ],
                        "where" : {
                           "type" : "And",
                           "operand" : [ {
                              "type" : "Equal",
                              "operand" : [ {
                                 "asType" : "{urn:hl7-org:elm-types:r1}Concept",
                                 "type" : "As",
                                 "operand" : {
                                    "path" : "medication",
                                    "scope" : "B",
                                    "type" : "Property"
                                 }
                              }, {
                                 "type" : "ToConcept",
                                 "operand" : {
                                    "name" : "Miglitol",
                                    "type" : "CodeRef"
                                 }
                              } ]
                           }, {
                              "type" : "Equivalent",
                              "operand" : [ {
                                 "path" : "status",
                                 "scope" : "B",
                                 "type" : "Property"
                              }, {
                                 "valueType" : "{urn:hl7-org:elm-types:r1}String",
                                 "value" : "completed",
                                 "type" : "Literal"
                              } ]
                           } ]
                        }
                     }
                  } ]
               }, {
                  "type" : "Exists",
                  "operand" : {
                     "type" : "Query",
                     "source" : [ {
                        "alias" : "C",
                        "expression" : {
                           "dataType" : "{http://hl7.org/fhir/us/qicore}MedicationDispense",
                           "templateId" : "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-medicationdispense",
                           "type" : "Retrieve"
                        }
                     } ],
                     "relationship" : [ ],
                     "where" : {
                        "type" : "And",
                        "operand" : [ {
                           "type" : "Equal",
                           "operand" : [ {
                              "asType" : "{urn:hl7-org:elm-types:r1}Concept",
                              "type" : "As",
                              "operand" : {
                                 "path" : "medication",
                                 "scope" : "C",
                                 "type" : "Property"
                              }
                           }, {
                              "type" : "ToConcept",
                              "operand" : {
                                 "name" : "insulin aspart",
                                 "type" : "CodeRef"
                              }
                           } ]
                        }, {
                           "type" : "Equivalent",
                           "operand" : [ {
                              "path" : "status",
                              "scope" : "C",
                              "type" : "Property"
                           }, {
                              "valueType" : "{urn:hl7-org:elm-types:r1}String",
                              "value" : "completed",
                              "type" : "Literal"
                           } ]
                        } ]
                     }
                  }
               } ]
            }
         }, {
            "name" : "Frailty",
            "context" : "Patient",
            "accessLevel" : "Public",
            "expression" : {
               "type" : "Or",
               "operand" : [ {
                  "type" : "Or",
                  "operand" : [ {
                     "type" : "Or",
                     "operand" : [ {
                        "type" : "Exists",
                        "operand" : {
                           "type" : "Query",
                           "source" : [ {
                              "alias" : "D",
                              "expression" : {
                                 "dataType" : "{http://hl7.org/fhir/us/qicore}Encounter",
                                 "templateId" : "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-encounter",
                                 "codeProperty" : "type",
                                 "codeComparator" : "in",
                                 "type" : "Retrieve",
                                 "codes" : {
                                    "name" : "Frailty Device",
                                    "type" : "ValueSetRef"
                                 }
                              }
                           } ],
                           "relationship" : [ ],
                           "where" : {
                              "type" : "In",
                              "operand" : [ {
                                 "path" : "period",
                                 "scope" : "D",
                                 "type" : "Property"
                              }, {
                                 "type" : "ToList",
                                 "operand" : {
                                    "name" : "MeasurementPeriod",
                                    "type" : "ParameterRef"
                                 }
                              } ]
                           }
                        }
                     }, {
                        "type" : "Exists",
                        "operand" : {
                           "type" : "Query",
                           "source" : [ {
                              "alias" : "Dia",
                              "expression" : {
                                 "dataType" : "{http://hl7.org/fhir/us/qicore}Encounter",
                                 "templateId" : "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-encounter",
                                 "codeProperty" : "type",
                                 "codeComparator" : "in",
                                 "type" : "Retrieve",
                                 "codes" : {
                                    "name" : "Frailty Diagnosis",
                                    "type" : "ValueSetRef"
                                 }
                              }
                           } ],
                           "relationship" : [ ],
                           "where" : {
                              "type" : "In",
                              "operand" : [ {
                                 "path" : "period",
                                 "scope" : "Dia",
                                 "type" : "Property"
                              }, {
                                 "type" : "ToList",
                                 "operand" : {
                                    "name" : "MeasurementPeriod",
                                    "type" : "ParameterRef"
                                 }
                              } ]
                           }
                        }
                     } ]
                  }, {
                     "type" : "Exists",
                     "operand" : {
                        "type" : "Query",
                        "source" : [ {
                           "alias" : "E",
                           "expression" : {
                              "dataType" : "{http://hl7.org/fhir/us/qicore}Encounter",
                              "templateId" : "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-encounter",
                              "codeProperty" : "type",
                              "codeComparator" : "in",
                              "type" : "Retrieve",
                              "codes" : {
                                 "name" : "Frailty Encounter",
                                 "type" : "ValueSetRef"
                              }
                           }
                        } ],
                        "relationship" : [ ],
                        "where" : {
                           "type" : "In",
                           "operand" : [ {
                              "path" : "period",
                              "scope" : "E",
                              "type" : "Property"
                           }, {
                              "type" : "ToList",
                              "operand" : {
                                 "name" : "MeasurementPeriod",
                                 "type" : "ParameterRef"
                              }
                           } ]
                        }
                     }
                  } ]
               }, {
                  "type" : "Exists",
                  "operand" : {
                     "type" : "Query",
                     "source" : [ {
                        "alias" : "S",
                        "expression" : {
                           "dataType" : "{http://hl7.org/fhir/us/qicore}Encounter",
                           "templateId" : "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-encounter",
                           "codeProperty" : "type",
                           "codeComparator" : "in",
                           "type" : "Retrieve",
                           "codes" : {
                              "name" : "Frailty Symptom",
                              "type" : "ValueSetRef"
                           }
                        }
                     } ],
                     "relationship" : [ ],
                     "where" : {
                        "type" : "In",
                        "operand" : [ {
                           "path" : "period",
                           "scope" : "S",
                           "type" : "Property"
                        }, {
                           "type" : "ToList",
                           "operand" : {
                              "name" : "MeasurementPeriod",
                              "type" : "ParameterRef"
                           }
                        } ]
                     }
                  }
               } ]
            }
         }, {
            "name" : "Acute Inpatient with Advanced Illness",
            "context" : "Patient",
            "accessLevel" : "Public",
            "expression" : {
               "type" : "Intersect",
               "operand" : [ {
                  "type" : "As",
                  "operand" : {
                     "dataType" : "{http://hl7.org/fhir/us/qicore}Encounter",
                     "templateId" : "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-encounter",
                     "codeProperty" : "type",
                     "codeComparator" : "in",
                     "type" : "Retrieve",
                     "codes" : {
                        "name" : "Acute Inpatient",
                        "type" : "ValueSetRef"
                     }
                  },
                  "asTypeSpecifier" : {
                     "type" : "ListTypeSpecifier",
                     "elementType" : {
                        "type" : "ChoiceTypeSpecifier",
                        "choice" : [ {
                           "name" : "{http://hl7.org/fhir/us/qicore}Condition",
                           "type" : "NamedTypeSpecifier"
                        }, {
                           "name" : "{http://hl7.org/fhir/us/qicore}Encounter",
                           "type" : "NamedTypeSpecifier"
                        } ]
                     }
                  }
               }, {
                  "type" : "As",
                  "operand" : {
                     "dataType" : "{http://hl7.org/fhir/us/qicore}Condition",
                     "templateId" : "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-condition",
                     "codeProperty" : "code",
                     "codeComparator" : "in",
                     "type" : "Retrieve",
                     "codes" : {
                        "name" : "Advanced Illness",
                        "type" : "ValueSetRef"
                     }
                  },
                  "asTypeSpecifier" : {
                     "type" : "ListTypeSpecifier",
                     "elementType" : {
                        "type" : "ChoiceTypeSpecifier",
                        "choice" : [ {
                           "name" : "{http://hl7.org/fhir/us/qicore}Condition",
                           "type" : "NamedTypeSpecifier"
                        }, {
                           "name" : "{http://hl7.org/fhir/us/qicore}Encounter",
                           "type" : "NamedTypeSpecifier"
                        } ]
                     }
                  }
               } ]
            }
         }, {
            "name" : "Acute Inpatient with Advanced Illness bool",
            "context" : "Patient",
            "accessLevel" : "Public",
            "expression" : {
               "type" : "Exists",
               "operand" : {
                  "type" : "Intersect",
                  "operand" : [ {
                     "type" : "As",
                     "operand" : {
                        "dataType" : "{http://hl7.org/fhir/us/qicore}Encounter",
                        "templateId" : "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-encounter",
                        "codeProperty" : "type",
                        "codeComparator" : "in",
                        "type" : "Retrieve",
                        "codes" : {
                           "name" : "Acute Inpatient",
                           "type" : "ValueSetRef"
                        }
                     },
                     "asTypeSpecifier" : {
                        "type" : "ListTypeSpecifier",
                        "elementType" : {
                           "type" : "ChoiceTypeSpecifier",
                           "choice" : [ {
                              "name" : "{http://hl7.org/fhir/us/qicore}Condition",
                              "type" : "NamedTypeSpecifier"
                           }, {
                              "name" : "{http://hl7.org/fhir/us/qicore}Encounter",
                              "type" : "NamedTypeSpecifier"
                           } ]
                        }
                     }
                  }, {
                     "type" : "As",
                     "operand" : {
                        "dataType" : "{http://hl7.org/fhir/us/qicore}Condition",
                        "templateId" : "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-condition",
                        "codeProperty" : "code",
                        "codeComparator" : "in",
                        "type" : "Retrieve",
                        "codes" : {
                           "name" : "Advanced Illness",
                           "type" : "ValueSetRef"
                        }
                     },
                     "asTypeSpecifier" : {
                        "type" : "ListTypeSpecifier",
                        "elementType" : {
                           "type" : "ChoiceTypeSpecifier",
                           "choice" : [ {
                              "name" : "{http://hl7.org/fhir/us/qicore}Condition",
                              "type" : "NamedTypeSpecifier"
                           }, {
                              "name" : "{http://hl7.org/fhir/us/qicore}Encounter",
                              "type" : "NamedTypeSpecifier"
                           } ]
                        }
                     }
                  } ]
               }
            }
         }, {
            "name" : "acute inpatient discharge with Advanced Illness",
            "context" : "Patient",
            "accessLevel" : "Public",
            "expression" : {
               "type" : "Exists",
               "operand" : {
                  "type" : "Query",
                  "source" : [ {
                     "alias" : "E",
                     "expression" : {
                        "name" : "Acute Inpatient with Advanced Illness",
                        "type" : "ExpressionRef"
                     }
                  } ],
                  "relationship" : [ ],
                  "where" : {
                     "type" : "Equivalent",
                     "operand" : [ {
                        "path" : "status",
                        "scope" : "E",
                        "type" : "Property"
                     }, {
                        "valueType" : "{urn:hl7-org:elm-types:r1}String",
                        "value" : "finished",
                        "type" : "Literal"
                     } ]
                  }
               }
            }
         }, {
            "name" : "diabetes exclusions",
            "context" : "Patient",
            "accessLevel" : "Public",
            "expression" : {
               "type" : "And",
               "operand" : [ {
                  "name" : "Frailty",
                  "type" : "ExpressionRef"
               }, {
                  "type" : "Or",
                  "operand" : [ {
                     "name" : "acute inpatient discharge with Advanced Illness",
                     "type" : "ExpressionRef"
                  }, {
                     "name" : "Acute Inpatient with Advanced Illness bool",
                     "type" : "ExpressionRef"
                  } ]
               } ]
            }
         }, {
            "name" : "DiabetesCondition",
            "context" : "Patient",
            "accessLevel" : "Public",
            "expression" : {
               "type" : "Or",
               "operand" : [ {
                  "type" : "Or",
                  "operand" : [ {
                     "type" : "Or",
                     "operand" : [ {
                        "name" : "acute inpatient encounter without telehealth",
                        "type" : "ExpressionRef"
                     }, {
                        "name" : "acute inpatient discharge on discharge claim",
                        "type" : "ExpressionRef"
                     } ]
                  }, {
                     "name" : "nonacute outpatient encounters with diabetes",
                     "type" : "ExpressionRef"
                  } ]
               }, {
                  "name" : "diabetes diagnosis by medication",
                  "type" : "ExpressionRef"
               } ]
            }
         }, {
            "name" : "HbA1c < 8",
            "context" : "Patient",
            "accessLevel" : "Public",
            "expression" : {
               "type" : "Exists",
               "operand" : {
                  "type" : "Intersect",
                  "operand" : [ {
                     "dataType" : "{http://hl7.org/fhir/us/qicore}Observation",
                     "templateId" : "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-observation",
                     "codeProperty" : "code",
                     "codeComparator" : "in",
                     "type" : "Retrieve",
                     "codes" : {
                        "name" : "HbA1c Lab Test",
                        "type" : "ValueSetRef"
                     }
                  }, {
                     "type" : "Union",
                     "operand" : [ {
                        "dataType" : "{http://hl7.org/fhir/us/qicore}Observation",
                        "templateId" : "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-observation",
                        "codeProperty" : "code",
                        "codeComparator" : "in",
                        "type" : "Retrieve",
                        "codes" : {
                           "name" : "HbA1c Level Less Than 7.0",
                           "type" : "ValueSetRef"
                        }
                     }, {
                        "dataType" : "{http://hl7.org/fhir/us/qicore}Observation",
                        "templateId" : "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-observation",
                        "codeProperty" : "code",
                        "codeComparator" : "in",
                        "type" : "Retrieve",
                        "codes" : {
                           "name" : "HbA1c Level Greater Than or Equal to 7.0 and Less Than 8.0",
                           "type" : "ValueSetRef"
                        }
                     } ]
                  } ]
               }
            }
         }, {
            "name" : "numerator",
            "context" : "Patient",
            "accessLevel" : "Public",
            "expression" : {
               "type" : "Case",
               "comparand" : {
                  "type" : "And",
                  "operand" : [ {
                     "type" : "And",
                     "operand" : [ {
                        "name" : "HbA1c < 8",
                        "type" : "ExpressionRef"
                     }, {
                        "name" : "DiabetesCondition",
                        "type" : "ExpressionRef"
                     } ]
                  }, {
                     "name" : "InitialPopulation",
                     "type" : "ExpressionRef"
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
            "name" : "denominator",
            "context" : "Patient",
            "accessLevel" : "Public",
            "expression" : {
               "type" : "Case",
               "comparand" : {
                  "type" : "And",
                  "operand" : [ {
                     "name" : "InitialPopulation",
                     "type" : "ExpressionRef"
                  }, {
                     "name" : "DiabetesCondition",
                     "type" : "ExpressionRef"
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
            "name" : "denominator_count",
            "context" : "Unfiltered",
            "accessLevel" : "Public",
            "expression" : {
               "type" : "Sum",
               "source" : {
                  "name" : "denominator",
                  "type" : "ExpressionRef"
               }
            }
         }, {
            "name" : "numerator_count",
            "context" : "Unfiltered",
            "accessLevel" : "Public",
            "expression" : {
               "type" : "Sum",
               "source" : {
                  "name" : "numerator",
                  "type" : "ExpressionRef"
               }
            }
         }, {
            "name" : "CDC_MeasureScore",
            "context" : "Unfiltered",
            "accessLevel" : "Public",
            "expression" : {
               "type" : "Divide",
               "operand" : [ {
                  "type" : "ToDecimal",
                  "operand" : {
                     "type" : "Sum",
                     "source" : {
                        "name" : "numerator",
                        "type" : "ExpressionRef"
                     }
                  }
               }, {
                  "type" : "ToDecimal",
                  "operand" : {
                     "type" : "Sum",
                     "source" : {
                        "name" : "denominator",
                        "type" : "ExpressionRef"
                     }
                  }
               } ]
            }
         } ]
      }
   }
}

