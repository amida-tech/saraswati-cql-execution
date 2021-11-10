const fs = require('fs');
const path = require('path');
const promisify = require('util').promisify;
const readdirp = promisify(fs.readdir);

const cqlfhir = require('cql-exec-fhir');
const cqlvsac = require('cql-exec-vsac');
var jsonl = require('jsonl');
const moment = require('moment');
var { cloneDeep } = require('lodash');
const { v4: uuidv4 } = require('uuid');

const config = require('../config');
const codes = require('../src/cql-code-service');
const cql = require('../src/cql');
const logger = require('../src/winston');

const measures = [];
const libraries = {};
const valuesets = [];
const engineLibraries = [];
let codeService;

logger.info('Exec Template started.');

async function jsonDirectoryScan(directory, results) {
  let files = await readdirp(directory);
  for(let file of files) {
    const readFile = fs.readFileSync(path.join(__dirname, '..', directory, file));
    results.push(JSON.parse(readFile, 'utf-8'));
  }
}

async function librariesDirectoryScan() {
  let files = await readdirp(config.librariesDirectory);
  for(let file of files) {
    const libraryFile = require(path.join('..', config.librariesDirectory, file));
    libraries[file.replace(/[-.]/g,'')] = libraryFile;
  }
}

// async function checkValueset() {
//   await codeService.(valuesets);
//   logger.info('CodeService valuesets finished.');
//   console.log(codeService);
// }

jsonDirectoryScan(config.measurementDirectory, measures).then(() => {
  logger.info('Measurement files located, count: ' + measures.length + '.');
});

librariesDirectoryScan().then(() => {
  logger.info('Library files located, count: ' + Object.keys(libraries).length + '.');
  measures.forEach(measure => {
    engineLibraries.push(new cql.Library(measure, new cql.Repository(libraries)));
  });
});

jsonDirectoryScan(config.valuesetsDirectory, valuesets).then(() => {
  logger.info('Valueset files located, count: ' + valuesets.length + '.');
  // codeService = new cqlvsac.CodeService(path.join(__dirname, 'vsac_cache'), true);
}).then(() => {
  // checkValueset(); 
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

  const lib = new cql.Library(measure, new cql.Repository(libraries));
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
