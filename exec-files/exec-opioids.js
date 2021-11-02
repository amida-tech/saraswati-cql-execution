const codeservice = require('../private/valuesets/2022/uop');
const { execute } = require('./exec-template');
const measure = require('../private/measurements/2022/UOP_HEDIS_MY2022-1.0.0.json');

const executeOpioids = (patients) => {
  return execute(measure, patients, codeservice);
};

module.exports = { executeOpioids };