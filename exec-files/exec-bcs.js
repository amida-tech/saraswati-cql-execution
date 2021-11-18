const codeservice = require('../private/valuesets/2022/bcs-e');
const { execute } = require('./exec-template');
const measure = require('../private/measurements/2022/BCSE_HEDIS_MY2022-1.0.0.json');

const executeBreastCancerScreening = (patients) => {
  return execute(measure, patients, codeservice);
};

module.exports = { executeBreastCancerScreening };