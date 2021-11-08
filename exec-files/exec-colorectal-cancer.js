const codeservice = require('../private/valuesets/2022/col-e');
const { execute } = require('./exec-template');
const measure = require('../private/measurements/2022/COLE_HEDIS_MY2022-1.0.0.json');

const executeColorectalCancer = (patients) => {
  return execute(measure, patients, codeservice);
};

module.exports = { executeColorectalCancer };