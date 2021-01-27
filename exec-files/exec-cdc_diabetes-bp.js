const codeservice = require('../data/codes/cdc_diabetes-bp-codes');
const { execute } = require('./exec-template');
const measure = require('../json-elm/cdc_diabetes-bp.json');
const patients = require('../data/patients/cdc_diabetes-bp-patients.json');

execute(measure, patients, codeservice);