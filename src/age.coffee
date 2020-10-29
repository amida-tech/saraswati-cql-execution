module.exports = {
   "library" : {
      "annotation" : [ {
         "translatorOptions" : "",
         "type" : "CqlToElmInfo"
      } ],
      "identifier" : {
         "id" : "test"
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
      "statements" : {
         "def" : [ {
            "name" : "test1",
            "context" : "Patient",
            "accessLevel" : "Public",
            "expression" : {
               "type" : "ToString",
               "operand" : {
                  "valueType" : "{urn:hl7-org:elm-types:r1}Boolean",
                  "value" : "true",
                  "type" : "Literal"
               }
            }
         }, {
            "name" : "test2",
            "context" : "Patient",
            "accessLevel" : "Public",
            "expression" : {
               "type" : "ToString",
               "operand" : {
                  "valueType" : "{urn:hl7-org:elm-types:r1}Boolean",
                  "value" : "false",
                  "type" : "Literal"
               }
            }
         } ]
      }
   }
}