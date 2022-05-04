const fs = require('fs');
const path = require('path');

const cqlfhir = require('cql-exec-fhir');
const moment = require('moment');
var { cloneDeep } = require('lodash');

const config = require('../config');
const codes = require('cql-execution/lib/cql-code-service');
const cql = require('cql-execution/lib/cql');
const logger = require('../src/winston');

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
  console.log(result.patientResults); // eslint-disable-line no-console
  console.log(result.unfilteredResults); // eslint-disable-line no-console
  const cleanedPatientResults = cleanData(result.patientResults);
  cleanedPatientResults.timeStamp = moment().format();

  return cleanedPatientResults;
};

const getIdentifier = (element) => {
 let id = '';
  if (element.fullUrl) {
    id = element.fullUrl;
  } else if (element.resource && element.resource.id) {
    id = element.resource.id;
  } else if (element.resource && element.resource.reference) {
    id = element.resource.reference;
  } else if (element.id) {
    id = element.id;
  } else if (element.reference) {
    id = element.reference;
  }
  return id;
};

const addToArray = (arrayToCheck, objectToAdd) => {
  let addValue = true;
  for (let i = 0; i < arrayToCheck.length; i += 1) {
    const item = arrayToCheck[i];
    let itemId = getIdentifier(item);
    let objectId = getIdentifier(objectToAdd);

    if (itemId === objectId) {
      addValue = false;
      break;
    }
  }

  if (addValue) {
    arrayToCheck.push(objectToAdd);
  }
};

const addArrayToArray = (arrayToCheck, arrayToAdd) => {
  arrayToAdd.forEach((element) => {
    if (element.actor) {
      addToArray(arrayToCheck, element.actor);
    } else if (element.individual) {
      addToArray(arrayToCheck, element.individual);
    } else if (element.provider) {
      addToArray(arrayToCheck, element.provider);
    } else if (element.reference) {
      addToArray(arrayToCheck, element);
    }
  });
};

const createProviderList = (entryList) => {
  let providers = [];
  entryList.forEach((entry) => {
    const fhirResource = entry.resource;
    const resourceType = fhirResource.resourceType;
    if (resourceType === 'Practitioner' ||
        resourceType === 'PractitionerRole' ||
        resourceType === 'Organization') {
      addToArray(providers, entry);
    } else if (resourceType === 'Encounter') {
      if (fhirResource.serviceProvider) {
        addToArray(providers, fhirResource.serviceProvider);
      }
      if (fhirResource.participant) {
        addArrayToArray(providers, fhirResource.participant);
      }
    } else if (resourceType === 'Claim') {
      if (fhirResource.provider) {
        addToArray(providers, fhirResource.provider);
      }
      if (fhirResource.careTeam) {
        addArrayToArray(providers, fhirResource.careTeam);
      }
    } else if (resourceType === 'Observation') {
      if (fhirResource.provider) {
        addToArray(providers, fhirResource.provider);
      }
      if (fhirResource.performer) {
        addArrayToArray(providers, fhirResource.performer);
      }
    } else if (resourceType === 'Immunization' && fhirResource.performer) {
      addArrayToArray(providers, fhirResource.performer);
    } else if (resourceType === 'Procedure' && fhirResource.performer) {
      addArrayToArray(providers, fhirResource.performer);
    } else if (resourceType === 'MedicationDispense' && fhirResource.performer) {
      addArrayToArray(providers, fhirResource.performer);
    } else if (resourceType === 'Condition' && fhirResource.recorder) {
      addToArray(providers, fhirResource.recorder);
    }
  });

  return providers;
};

const evalData = (patient) => {
  const data = execute(patient);
  if (data.Denominator != 0) {
    const memberId = Object.keys(data).find((key) => key.toLowerCase() !== 'timestamp')
    data['memberId'] = memberId;
    data['measurementType'] = config.measurementType;
    data['coverage'] = data[memberId]['Member Coverage'];
    data['providers'] = createProviderList(patient[0].entry);
    return data;
  }
  return undefined;
};

module.exports = { execute, cleanData, evalData, initialize, valueSetJSONCompile };
