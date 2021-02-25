const codeservice = require('../data/codes/cdc_hba1c-codes');
const { execute } = require('./exec-template');
const measure = require('../json-elm/cdc_hba1c-lessThanEight.json');
const patients = require('../data/patients/cdc_hba1c-patients.json');

execute(measure, patients, codeservice);
