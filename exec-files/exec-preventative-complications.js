const codeservice = require('../data/codes/preventative-complications');
const { execute } = require('./exec-template');
const measure = require('../json-elm/preventative-complications.json');
//const patients = require('../data/patients/depression/depression-screening-follow-up.json');

const executePreventativeComplications= (patients) => {
  return execute(measure, patients, codeservice);
};

module.exports = { executePreventativeComplications };
