const codeservice = require('../private/valuesets/2022/cis-e');
const { execute } = require('./exec-template');

const measure = require('../private/measurements/2022/CISE_HEDIS_MY2022-1.0.0.json');
// const measure = require('../json-elm/CISE_HEDIS_MY2022-1.0.0.json');
// const patients = require('../data/patients/immunization/childhood-immunization-status-patients.json');

const executeNEWImmunization = (patients) => {
  return execute(measure, patients, codeservice);
};

module.exports = { executeNEWImmunization };