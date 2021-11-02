const codeservice = require('../private/valuesets/2022/drr-e');
const { execute } = require('./exec-template');
const measure = require('../private/measurements/2022/DRRE_HEDIS_MY2022-1.0.0');

const executeDepressionRemission = (patients) => {
  return execute(measure, patients, codeservice);
};

module.exports = { executeDepressionRemission };