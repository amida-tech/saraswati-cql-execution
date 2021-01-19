const codeservice = require('../data/codes/cdc_hba1c-codes');
const executor = require('./exec-template');
const measure = require('../json-elm/cdc_hba1c-lessThanEight.json');
const patients = require('../data/patients/cdc_hba1c-patients');

executor('2018-12-31', '2019-12-31', measure, patients, codeservice);
