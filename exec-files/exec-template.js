var fs = require('fs');
const cqlfhir = require('cql-exec-fhir');
var jsonl = require('jsonl');
var { cloneDeep } = require('lodash');
const { v4: uuidv4 } = require('uuid');
const codes = require('../src/cql-code-service');
const cql = require('../src/cql');
const fhirhelpers = require('../json-elm/FHIRHelpers.json');
const fhirhelpers401 = require('../private/CISE_HEDIS_MY2022-1.0.0/libraryElm/FHIRHelpers-4.0.1.json');
const diabetes_library = require('../json-elm/Diabetes_Library.json');
const cql_base = require('../private/CISE_HEDIS_MY2022-1.0.0/libraryElm/NCQA_CQLBase-1.0.0.json');
const cql_fhirbase = require('../private/CISE_HEDIS_MY2022-1.0.0/libraryElm/NCQA_FHIRBase-1.0.0.json');
const cql_healthplanEnrollementbase = require('../private/CISE_HEDIS_MY2022-1.0.0/libraryElm/NCQA_HealthPlanEnrollment-1.0.0.json');
const NCQA_Hospice = require('../private/CISE_HEDIS_MY2022-1.0.0/libraryElm/NCQA_Hospice-1.0.0.json');
const NCQA_Immunization = require('../private/CISE_HEDIS_MY2022-1.0.0/libraryElm/NCQA_Immunization-1.0.0.json');
const NCQA_Status = require('../private/CISE_HEDIS_MY2022-1.0.0/libraryElm/NCQA_Status-1.0.0.json');
const NCQA_Terminology = require('../private/CISE_HEDIS_MY2022-1.0.0/libraryElm/NCQA_Terminology-1.0.0.json');
const moment = require('moment');

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
  const includedLibs = {
    FHIRHelpers: fhirhelpers,
    Diabetes_Library: diabetes_library,
    FHIRHelpers401: fhirhelpers401,
    CQLBase: cql_base,
    CQLFhirBase: cql_fhirbase,
    CQLHealthPlanEnrollement: cql_healthplanEnrollementbase,
    CQLImmunization: NCQA_Immunization,
    CQLStatus: NCQA_Status,
    CQLTerminology: NCQA_Terminology,
    CQLHospice: NCQA_Hospice
  };

  const lib = new cql.Library(measure, new cql.Repository(includedLibs));
  const cservice = new codes.CodeService(codeservice);

  const executor = new cql.Executor(lib, cservice);
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
