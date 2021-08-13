const codeservice = require('../data/codes/preventable-complications-codes');
const { execute } = require('./exec-template');
const measure = require('../json-elm/preventable-complications.json');
//const patients = require('../data/patients/depression/depression-screening-follow-up.json');

const executePreventable = (patients) => {
  return execute(measure, patients, codeservice);
};

module.exports = { executePreventable };
