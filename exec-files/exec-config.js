const fs = require('fs');
const path = require('path');

const cqlfhir = require('cql-exec-fhir');
const moment = require('moment');
var { cloneDeep } = require('lodash');
const saraswatiVersion = require('../package.json').version;

const config = require('../config');
const codes = require('cql-execution/lib/cql-code-service');
const cql = require('cql-execution/lib/cql');
const logger = require('../src/winston');

const { createProviderList } = require('../src/utilities/providerUtil');

let measure;
let support;
let libraries;
let valueSets;
let engineLibraries;
let supportLibraries;
let codeService;
const messageListener = new cql.ConsoleMessageListener();
const parameters = {
  'Measurement Period' : new cql.Interval(
    new cql.DateTime(Number(config.measurementYear), 1, 1, 0, 0, 0, 0, false, false),
    new cql.DateTime(Number(config.measurementYear) + 1, 1, 1, 0, 0, 0, 0, false , false),
    true,
    false
  )
};

const patientSource = cqlfhir.PatientSource.FHIRv401();

logger.info('Exec config building.');

const getDirFilePath = (dirFile) => {
  if (dirFile.startsWith('/') || dirFile.startsWith('.')) {
    return dirFile;
  }
  return path.join(__dirname, '..', dirFile)
}

function measurementFileScan() {
  const measurementFilePath = getDirFilePath(config.measurementFile);
  measure = JSON.parse(
    fs.readFileSync(measurementFilePath),
    'utf-8');
  logger.info(`Measurement file located: ${measurementFilePath}.`);
}

function supportFileScan() {
  const supportFilePath = getDirFilePath(config.supportFile);
  if (supportFilePath != undefined) {
    support = JSON.parse(
      fs.readFileSync(supportFilePath),
      'utf-8');
    logger.info(`Support file located: ${supportFilePath}.`);
  } else {
    logger.info('No support file located. Continuing without.');
  }
}

// You must run the measurementFileScan before this.
function librariesDirectoryScan() {
  const libraryDirPath = getDirFilePath(config.librariesDirectory);
  let files = fs.readdirSync(libraryDirPath);
  for(let file of files) {
    if (file.endsWith('.json')) {
      const libraryFile = require(path.join(libraryDirPath, file));
      libraries[file.replace(/[-.]/g,'')] = libraryFile;
    }
  }
  logger.info(`Library files located, count: ${Object.keys(libraries).length}.`);
  engineLibraries = new cql.Library(measure, new cql.Repository(libraries));
  if (support != undefined) {
    const measurementDirPath = getDirFilePath(config.measurementFile);
    libraries[config.measurementType] = require(measurementDirPath);
    supportLibraries = new cql.Library(support, new cql.Repository(libraries));
  }
}

// We can speed this up slightly by running it asynchronously. But it's not an issue right now.
function valueSetsDirectoryCompile() {
  const valuesetsDirPath = getDirFilePath(config.valuesetsDirectory);
  let files = fs.lstatSync(valuesetsDirPath).isDirectory() ?
    fs.readdirSync(valuesetsDirPath) :
    [valuesetsDirPath];

  for (let file of files) {
    if (file.endsWith('.json')) {
      valueSetJSONCompile(file);
    }

    if (file.endsWith('.js')) {
      valueSetJavaScriptCompile(file);
    }
  }
  logger.info(`Value set files located, count: ${Object.keys(valueSets).length}.`);
  codeService = new codes.CodeService(valueSets);
}

function valueSetJSONCompile(file) {
  const valuesetsDirPath = getDirFilePath(config.valuesetsDirectory);
  const vsFile = JSON.parse(fs.readFileSync(path.join(valuesetsDirPath, file)));
  if (!vsFile.expansion || !vsFile.expansion.contains) {
    logger.error(`No "expansion.contains" found in ${file}, skipping.`);
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
  const valuesetsDirPath = getDirFilePath(config.valuesetsDirectory);
  let filePath;
  if (fs.existsSync(path.join(__dirname, '..', file))) {
    filePath = path.join(__dirname, '..', file);
  } else if (fs.existsSync(path.join(valuesetsDirPath, file))) {
    filePath = path.join(valuesetsDirPath, file);
  } else {
    logger.warn(`Was unable to find location of ${file}. Skipping addition.`);
    return;
  }
  Object.assign(valueSets, require(filePath));
}

function initialize() {
  measure = {};
  libraries = {};
  valueSets = {};
  measurementFileScan();
  if (config.supportFile) {
    supportFileScan();
  }
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

    // Remove valuesets - not needed
    switch(config.measurementType) {
      case 'aab':
      case 'cwp':
      case 'uri':
        delete patient['Outpatient Encounters'];
        delete patient['Antibiotic Medication'];
        delete patient['Comorbid Conditions Diagnosis'];
        delete patient['Competing Condition Diagnosis'];

        if (config.measurementType === 'aab') {
          delete patient['Bronchitis Diagnosis']
        } else if (config.measurementType === 'cwp') {
          delete patient['Pharyngitis Diagnosis'];
        } else if (config.measurementType === 'uri') {
          delete patient['URI Diagnosis'];
        }
        break;
      case 'apme':
        delete patient['Antipsychotic Medication'];
        break;
      case 'cou':
        delete patient['Opioid Medication Valuesets'];
        break;
      case 'fum':
        delete patient['Mental Illness or Intentional Self-Harm'];
        break;
      case 'psa':
        delete patient['PSA Lab Test Value Set'];
        delete patient['PSA Lab Test Finding Value Set'];
        break;
      case 'uop':
        delete patient['Opioid Medication Valuesets'];
        break;
    }
  });
  return clonedPatientResults;
};

const cleanSupport = patientResults => {
  const supportData = {}
  Object.keys(patientResults).forEach((patientKey) => {
    Object.keys(patientResults[patientKey]).forEach((dataKey) => {
      if (dataKey.startsWith('Data Numerator') || dataKey.startsWith('Certification')) {
        supportData[dataKey] = patientResults[patientKey][dataKey];
      }
    });
  });
  return supportData;
};

const execute = (patients) => {
  const executor = new cql.Executor(engineLibraries, codeService, parameters, messageListener);
  patientSource.loadBundles(patients);
  const result = executor.exec(patientSource);
  // logger.info(result.patientResults); // eslint-disable-line no-console
  // logger.info(result.unfilteredResults); // eslint-disable-line no-console
  const cleanedPatientResults = cleanData(result.patientResults);
  cleanedPatientResults.timeStamp = moment().format();

  return cleanedPatientResults;
};

const supportExecute = (patients) => {
  const executor = new cql.Executor(supportLibraries, codeService, parameters, messageListener);
  patientSource.loadBundles(patients);
  const result = executor.exec(patientSource);
  return cleanSupport(result.patientResults);
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
      data['version'] = saraswatiVersion;
      return data;

  }
  return undefined;
};

module.exports = { execute, supportExecute, cleanData, evalData, initialize, valueSetJSONCompile };
