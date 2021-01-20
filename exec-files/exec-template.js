const codes = require('../src/cql-code-service');
const cql = require('../src/cql');
const cqlfhir = require('cql-exec-fhir');
const fhirhelpers = require('../json-elm/FHIRHelpers.json');

const executor = (startDate, endDate, measure, patients, codeservice) => {
  const includedLibs = {
    FHIRHelpers: fhirhelpers
  };
  const lib = new cql.Library(measure, new cql.Repository(includedLibs));
  const cservice = new codes.CodeService(codeservice);
  const parameters = {
    MeasurementPeriod: new cql.Interval(
      cql.DateTime.parse(startDate),
      cql.DateTime.parse(endDate),
      true,
      false
    )
  };

  const executor = new cql.Executor(lib, cservice, parameters);
  const patientSource = cqlfhir.PatientSource.FHIRv400();
  patientSource.loadBundles(patients);

  const result = executor.exec(patientSource);
  console.log(result.patientResults); // eslint-disable-line no-console
  console.log(result.unfilteredResults); // eslint-disable-line no-console
  return result;
};

module.exports = executor;
