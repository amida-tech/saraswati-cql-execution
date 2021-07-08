const codeservice = require('../data/codes/cdc_diabetes-bp-codes');
const { execute } = require('./exec-template');
const measure = require('../json-elm/readmission.json');
//const patients = require('../data/patients/diabetes/cdc_diabetes-bp-patients.json');

const executeReadmission = (patients) => {
  return execute(measure, patients, codeservice);
};

module.exports = { executeReadmission };