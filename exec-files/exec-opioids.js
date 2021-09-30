const codeservice = require('../private/UOP_HEDIS_MY2022-1.0.0/valuesets/opioids');
const { execute } = require('./exec-template');
const measure = require('../private/UOP_HEDIS_MY2022-1.0.0/elm/UOP_HEDIS_MY2022-1.0.0.json');

const executeOpioids = (patients) => {
  return execute(measure, patients, codeservice);
};

module.exports = { executeOpioids };