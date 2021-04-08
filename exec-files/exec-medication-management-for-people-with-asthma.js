const codeservice = require('../data/codes/medication-management-for-people-with-asthma-codes');
const { execute } = require('./exec-template');
const measure = require('../json-elm/medication-management-for-people-with-asthma.json');
const patients = require('../data/patients/medication-management-for-people-with-asthma-patients.json');

execute(measure, patients, codeservice);
