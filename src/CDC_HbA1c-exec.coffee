cql = require './cql'
measure = require './CDC_HbA1c'
codes = require './cql-code-service'
codeservice = require '../src/data/codeservice'
patients = require '../src/data/aggregate_data_wo_claim.json'

cservice = new codes.CodeService {codeservice}

lib = new cql.Library(measure)

parameters = {
  MeasurementPeriod: new cql.Interval(cql.DateTime.parse('2018-12-31'), cql.DateTime.parse('2019-12-31'), true, false)
}

executor = new cql.Executor(lib, cservice, parameters)

psource = new cql.PatientSource patients

result = executor.exec(psource)

console.log("done")
console.log(result)
