const codeservice = require('../private/valuesets/2022/ais-e');
const { execute } = require('./exec-template');
const measure = require('../private/measurements/2022/AISE_HEDIS_MY2022-1.0.0.json');

const executeAdultImmunization = (patients) => {
  return execute(measure, patients, codeservice);
};

module.exports = { executeAdultImmunization };