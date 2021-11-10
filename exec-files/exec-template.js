const fs = require('fs');
const path = require('path');
const config = require('../config');
const cqlfhir = require('cql-exec-fhir');
var jsonl = require('jsonl');
var { cloneDeep } = require('lodash');
const { v4: uuidv4 } = require('uuid');
const codes = require('../src/cql-code-service');
const cql = require('../src/cql');
const moment = require('moment');

const includedLibs = {};
fs.readdir(config.librariesDirectory, (err, files) => {
  files.forEach(file => {
    includedLibs[file.replace(/[-.]/g,'')] = require(path.join('..', config.librariesDirectory, file));
  });
});

const removeArrayValues = patient => {
  const clonedPatient = cloneDeep(patient);
  Object.entries(clonedPatient).forEach(([propertyKey, propertyValue]) => {
    // remove property values that are arrays - the data pipeline doesn't need them
    if (Array.isArray(propertyValue)) {
      delete patient[propertyKey];
    }
  });
  return patient;
};

const cleanData = patientResults => {
  const clonedPatientResults = cloneDeep(patientResults);
  Object.entries(clonedPatientResults).forEach(([patientKey, patientValue]) => {
    const patient = patientValue;
    // remove Patient data - not needed
    delete patient.Patient;
    patient.id = patientKey;

    removeArrayValues(patient);
  });
  return clonedPatientResults;
};

const execute = (measure, patients, codeservice) => {

  const lib = new cql.Library(measure, new cql.Repository(includedLibs));
  const cservice = new codes.CodeService(codeservice);
  const messageListener = new cql.ConsoleMessageListener();
  const parameters = {
    'Measurement Period' : new cql.Interval(
      new cql.DateTime(Number(config.measurementYear), 1, 1, 0, 0, 0, 0),
      new cql.DateTime(Number(config.measurementYear) + 1, 1, 1, 0, 0, 0, 0),
      true,
      false
    )
  };

  const executor = new cql.Executor(lib, cservice, parameters, messageListener);
  const patientSource = cqlfhir.PatientSource.FHIRv401();
  patientSource.loadBundles(patients);

  const result = executor.exec(patientSource);
  console.log(result.patientResults); // eslint-disable-line no-console
  console.log(result.unfilteredResults); // eslint-disable-line no-console

  const cleanedPatientResults = cleanData(result.patientResults);
  cleanedPatientResults.timeStamp = moment().format();

  const convertToJSONL = err => {
    if (err) {
      console.error(err);
    } else {
      fs.createReadStream('./exec-files/results.json')
        .pipe(jsonl())
        .pipe(fs.createWriteStream(`./exec-files/results-${uuidv4()}.jsonl`));
    }
  };

  // fs.writeFile('./exec-files/results.json', JSON.stringify(cleanedPatientResults), err =>
  //   convertToJSONL(err)
  // );
  return cleanedPatientResults;
};

module.exports = { execute, cleanData };
