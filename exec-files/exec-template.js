var fs = require('fs');
const config = require('../config');
const cqlfhir = require('cql-exec-fhir');
var jsonl = require('jsonl');
var { cloneDeep } = require('lodash');
const { v4: uuidv4 } = require('uuid');
const codes = require('../src/cql-code-service');
const cql = require('../src/cql');
const fhirhelpers = require('../json-elm/FHIRHelpers.json');
const fhirhelpers401 = require('../private/libraries/FHIRHelpers-4.0.1.json');
const diabetes_library = require('../json-elm/Diabetes_Library.json');
const NCQA_Claims = require('../private/libraries/NCQA_Claims-1.0.0.json');
const cql_base = require('../private/libraries/NCQA_CQLBase-1.0.0.json');
const cql_fhirbase = require('../private/libraries/NCQA_FHIRBase-1.0.0.json');
const cql_healthplanEnrollmentbase = require('../private/libraries/NCQA_HealthPlanEnrollment-1.0.0.json');
const NCQA_Hospice = require('../private/libraries/NCQA_Hospice-1.0.0.json');
const NCQA_Medication = require('../private/libraries/NCQA_Medication-1.0.0.json');
const NCQA_Immunization = require('../private/libraries/NCQA_Immunization-1.0.0.json');
const NCQA_Status = require('../private/libraries/NCQA_Status-1.0.0.json');
const NCQA_Terminology = require('../private/libraries/NCQA_Terminology-1.0.0.json');
const NCQA_PalliativeCare = require('../private/libraries/NCQA_PalliativeCare-1.0.0.json');
const NCQA_AdvancedFrailty = require('../private/libraries/NCQA_AdvancedIllnessandFrailty-1.0.0.json');
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
    CQLClaims: NCQA_Claims,
    CQLFhirBase: cql_fhirbase,
    CQLHealthPlanEnrollment: cql_healthplanEnrollmentbase,
    CQLImmunization: NCQA_Immunization,
    CQLMedication: NCQA_Medication,
    CQLStatus: NCQA_Status,
    CQLTerminology: NCQA_Terminology,
    CQLHospice: NCQA_Hospice,
    CQLPalliativeCare: NCQA_PalliativeCare,
    CQLAdvancedFrailty: NCQA_AdvancedFrailty
  };

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
