const codeservice = require('../private/DRRE_HEDIS_MY2022-1.0.0/valuesets/drre');
const { execute } = require('./exec-template');
const measure = require('../private/DRRE_HEDIS_MY2022-1.0.0/elm/DRRE_HEDIS_MY2022-1.0.0.json');

const executeDepressionRemission = (patients) => {
  return execute(measure, patients, codeservice);
};

module.exports = { executeDepressionRemission };