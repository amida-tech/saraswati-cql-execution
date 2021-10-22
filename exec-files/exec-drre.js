const codeservice = require('../private/DRRE_HEDIS_MY2022-1.0.0/valuesets/drre');
const { execute } = require('./exec-template');
const measure = require('../private/drre-cql.json');

const executeDepressionRemission = (patients) => {
  return execute(measure, patients, codeservice);
};

module.exports = { executeDepressionRemission };