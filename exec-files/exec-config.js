const fs = require('fs');
const path = require('path');
const promisify = require('util').promisify;
const readdirp = promisify(fs.readdir);

const cqlfhir = require('cql-exec-fhir');
const moment = require('moment');
var { cloneDeep } = require('lodash');

const config = require('../config');
const codes = require('../src/cql-code-service');
const cql = require('../src/cql');
const logger = require('../src/winston');

let measure = {};
const libraries = {};
const valueSets = {};
let engineLibraries;
let codeService;
const messageListener = new cql.ConsoleMessageListener();
const parameters = {
  'Measurement Period' : new cql.Interval(
    new cql.DateTime(Number(config.measurementYear), 1, 1, 0, 0, 0, 0),
    new cql.DateTime(Number(config.measurementYear) + 1, 1, 1, 0, 0, 0, 0),
    true,
    false
  )
};
const patientSource = cqlfhir.PatientSource.FHIRv401();

logger.info('Exec config building.');

async function measurementFileScan() {
  measure = JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', config.measurementFile)),
    'utf-8');
}

async function librariesDirectoryScan() {
  let files = await readdirp(config.librariesDirectory);
  for(let file of files) {
    if (file.endsWith('.json')) {
      const libraryFile = require(path.join('..', config.librariesDirectory, file));
      libraries[file.replace(/[-.]/g,'')] = libraryFile;
    }
  }
}

async function valueSetsDirectoryCompile() {
  let files = await readdirp(config.valuesetsDirectory);
  for(let file of files) {
    if (file.endsWith('.json')) {
      valueSetJSONCompile(file);
    }

    if (file.endsWith('.js')) {
      valueSetJavaScriptCompile(file);
    }
  }
}

function valueSetJSONCompile(file) {
  const vsFile = JSON.parse(fs.readFileSync(path.join(__dirname, '..', config.valuesetsDirectory, file)));
  if (!vsFile.expansion || !vsFile.expansion.contains) {
    throw new Error('No "expansion.contains" found in ' + file + '.');
  }

  const contains = vsFile.expansion.contains.map(container => {
    delete container.display;
    return container;
  });

  let title;
  if (vsFile.title) {
    title = vsFile.title;
  } else {
    logger.warn('No "title" was found. Please manually update.');
    title = 'No Title Found';
  }
  
  let oidKey;
  if (vsFile.url) {
    oidKey = vsFile.url;
  } else {
    logger.warn('Using filename for oidKey.');
    oidKey = 'https://www.ncqa.org/fhir/valueset/' + file.slice(0,-5);
  }

  valueSets[oidKey] = {
    [title]: contains
  };
}

function valueSetJavaScriptCompile(file) {
  Object.assign(valueSets, require(path.join(__dirname, '..', config.valuesetsDirectory, file)));
}
measurementFileScan().then(() => {
  logger.info('Measurement file located: ' + config.measurementFile + '.');
});

librariesDirectoryScan().then(() => {
  logger.info('Library files located, count: ' + Object.keys(libraries).length + '.');
  engineLibraries = new cql.Library(measure, new cql.Repository(libraries));
});

valueSetsDirectoryCompile().then(() => {
  logger.info('Value set files located, count: ' + Object.keys(valueSets).length + '.');
  codeService = new codes.CodeService(valueSets);
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

const execute = (patients) => {
  const executor = new cql.Executor(engineLibraries, codeService, parameters, messageListener);
  patientSource.loadBundles(patients);

  const result = executor.exec(patientSource);
  console.log(result.patientResults); // eslint-disable-line no-console
  console.log(result.unfilteredResults); // eslint-disable-line no-console

  const cleanedPatientResults = cleanData(result.patientResults);
  cleanedPatientResults.timeStamp = moment().format();

  return cleanedPatientResults;
};

module.exports = { execute, cleanData };
