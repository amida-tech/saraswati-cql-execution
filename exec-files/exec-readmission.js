const codeservice = require('../data/codes/readmission-codes');
const { execute } = require('./exec-template');
const measure = require('../json-elm/readmission.json');

const executeReadmission = (patients) => {
  return execute(measure, patients, codeservice);
};

module.exports = { executeReadmission };