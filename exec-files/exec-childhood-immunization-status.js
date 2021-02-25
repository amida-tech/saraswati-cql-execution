const codeservice = require('../data/codes/childhood-immunization-status-codes');
const { execute } = require('./exec-template');
const measure = require('../json-elm/childhood-immunization-status.json');
const patients = require('../data/patients/childhood-immunization-status-patients.json');

execute(measure, patients, codeservice);
