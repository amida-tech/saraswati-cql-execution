const fs = require('fs');
const cqlfhir = require('cql-exec-fhir');
const { v4: uuidv4 } = require('uuid');
const codes = require('../src/cql-code-service');
const cql = require('../src/cql');
const fhirhelpers = require('../json-elm/FHIRHelpers.json');

const executor = (measure, patients, codeservice) => {
  const includedLibs = {
    FHIRHelpers: fhirhelpers
  };
  const lib = new cql.Library(measure, new cql.Repository(includedLibs));
  const cservice = new codes.CodeService(codeservice);

  const executor = new cql.Executor(lib, cservice);
  const patientSource = cqlfhir.PatientSource.FHIRv400();
  patientSource.loadBundles(patients);

  const result = executor.exec(patientSource);
  console.log(result.patientResults); // eslint-disable-line no-console
  console.log(result.unfilteredResults); // eslint-disable-line no-console

  fs.writeFile(
    `./exec-files/results-${uuidv4()}.json`,
    JSON.stringify(result.unfilteredResults),
    err => err && console.error(err)
  );
};

module.exports = executor;
