const fs = require('fs');
const path = require('path');

const cqlfhir = require('cql-exec-fhir');
const moment = require('moment');
var { cloneDeep } = require('lodash');

const config = require('../config');
const codes = require('cql-execution/lib/cql-code-service');
const cql = require('cql-execution/lib/cql');
const logger = require('../src/winston');

const { createProviderList } = require('../src/utilities/providerUtil');

let measure;
let libraries;
let valueSets;
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

function measurementFileScan() {
  measure = JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', config.measurementFile)),
    'utf-8');
  logger.info('Measurement file located: ' + config.measurementFile + '.');
}

// You must run the measurementFileScan before this.
function librariesDirectoryScan() {
  let files = fs.readdirSync(config.librariesDirectory);
  for(let file of files) {
    if (file.endsWith('.json')) {
      const libraryFile = require(path.join('..', config.librariesDirectory, file));
      libraries[file.replace(/[-.]/g,'')] = libraryFile;
    }
  }
  logger.info('Library files located, count: ' + Object.keys(libraries).length + '.');
  engineLibraries = new cql.Library(measure, new cql.Repository(libraries));
}

// We can speed this up slightly by running it asynchronously. But it's not an issue right now.
function valueSetsDirectoryCompile() {
  let files = fs.lstatSync(config.valuesetsDirectory).isDirectory() ?
    fs.readdirSync(config.valuesetsDirectory) :
    [config.valuesetsDirectory];

  for (let file of files) {
    if (file.endsWith('.json')) {
      valueSetJSONCompile(file);
    }

    if (file.endsWith('.js')) {
      valueSetJavaScriptCompile(file);
    }
  }
  logger.info('Value set files located, count: ' + Object.keys(valueSets).length + '.');
  codeService = new codes.CodeService(valueSets);
}

function valueSetJSONCompile(file) {
  const vsFile = JSON.parse(fs.readFileSync(path.join(__dirname, '..', config.valuesetsDirectory, file)));
  if (!vsFile.expansion || !vsFile.expansion.contains) {
    logger.error('No "expansion.contains" found in ' + file + ', skipping.');
    return;
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

// Uncommon for .js files to be in the same folders as .json files. However,
// will check all likely locations.
function valueSetJavaScriptCompile(file) {
  let filePath;
  if (fs.existsSync(path.join(__dirname, '..', file))) {
    filePath = path.join(__dirname, '..', file);
  } else if (fs.existsSync(path.join(__dirname, '..', config.valuesetsDirectory, file))) {
    filePath = path.join(__dirname, '..', config.valuesetsDirectory, file);
  } else {
    logger.warn('Was unable to find location of ' + file + '. Skipping addition.');
    return;
  }
  Object.assign(valueSets, require(filePath));
}

function initialize() {
  measure = {};
  libraries = {};
  valueSets = {};
  measurementFileScan();
  librariesDirectoryScan();
  valueSetsDirectoryCompile();
}

initialize();

const cleanData = patientResults => {
  const clonedPatientResults = cloneDeep(patientResults);
  Object.entries(clonedPatientResults).forEach(([patientKey, patientValue]) => {
    const patient = patientValue;
    // remove Patient data - not needed
    delete patient.Patient;
    patient.id = patientKey;
  });
  return clonedPatientResults;
};

const execute = (patients) => {
  const executor = new cql.Executor(engineLibraries, codeService, parameters, messageListener);
  patientSource.loadBundles(patients);
  const result = executor.exec(patientSource);
  // console.log(result.patientResults); // eslint-disable-line no-console
  // console.log(result.unfilteredResults); // eslint-disable-line no-console
  const cleanedPatientResults = cleanData(result.patientResults);
  cleanedPatientResults.timeStamp = moment().format();

  return cleanedPatientResults;
};

const hasDenominator = (patientData) => {
  const denominatorFields = Object.keys(patientData).filter(
    (patientField) => patientField.startsWith('Denominator')
  );

  for (const field of denominatorFields) {
    const fieldValue = patientData[field];
    let value = 0;
    if (Array.isArray(fieldValue)) {
      value = fieldValue.length;
    } else {
      value = fieldValue === true ? 1 : 0;
    }

    if (value > 0) {
      return true;
    }
  }
  return false;
};

const evalData = (patient) => {
  const data = execute(patient);

  const memberId = Object.keys(data).find((key) => key.toLowerCase() !== 'timestamp');
  const patientData = data[memberId];
  if (hasDenominator(patientData)) {
    const entryList = Array.isArray(patient) ? patient[0].entry : patient.entry;
    const patientInfo = entryList.find((results) => results.resource.resourceType === 'Patient')
    const patientInfoNeeded = patientInfo.resource;
    const birthDateFound = patientInfoNeeded.birthDate;
    const genderFound = patientInfoNeeded.gender;
      data['memberId'] = memberId;
      data['birthDate'] = birthDateFound;
      data['gender'] = genderFound;
      data['measurementType'] = config.measurementType;
      data['coverage'] = patientData['Member Coverage'];
      data['providers'] = createProviderList(patient);
      return data;

  }
  return undefined;
};

module.exports = { execute, cleanData, evalData, initialize, valueSetJSONCompile };
