var fs = require('fs');
const cqlfhir = require('cql-exec-fhir');
var jsonl = require('jsonl');
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

  const removeArrayValues = patient => {
    Object.entries(patient).forEach(([propertyKey, propertyValue]) => {
      // remove property values that are arrays - the data pipeline doesn't need them
      if (Array.isArray(propertyValue)) {
        delete patient[propertyKey];
      }
    });
  };

  const cleanData = patientResults => {
    Object.entries(patientResults).forEach(([patientKey, patientValue]) => {
      const patient = patientValue;
      // remove Patient data - not needed
      delete patient.Patient;
      patient.id = patientKey;

      removeArrayValues(patient);
    });
  };

  const convertToJSONL = err => {
    if (err) {
      console.error(err);
    } else {
      fs.createReadStream('./exec-files/results.json')
        .pipe(jsonl())
        .pipe(fs.createWriteStream(`./exec-files/results-${uuidv4()}.jsonl`));
    }
  };

  cleanData(result.patientResults);

  fs.writeFile('./exec-files/results.json', JSON.stringify(result.patientResults), err =>
    convertToJSONL(err)
  );
};

module.exports = executor;
