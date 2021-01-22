const codeservice = require('../data/codes/cis-codes');
const executor = require('./exec-template');
const measure = require('../json-elm/cis.json');
const patients = require('../data/patients/cis-patients.json');

executor(measure, patients, codeservice);
