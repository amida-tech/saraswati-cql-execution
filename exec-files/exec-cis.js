const codeservice = require('../data/codes/cis-codes');
const executor = require('./exec-template');
const measure = require('../json-elm/cis.json');
const patients = require('../data/patients/cis-patients.json');

executor('2018-12-31', '2019-12-31', measure, patients, codeservice);
