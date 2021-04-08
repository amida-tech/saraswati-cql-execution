const codeservice = require('../data/codes/ppc-codes');
const { execute } = require('./exec-template');
const measure = require('../json-elm/prenatal-postpartum-care.json');
const patients = require('../data/patients/prenatal-postpartum-care-patients.json');
console.log(JSON.stringify(patients, undefined, 2));
execute(measure, patients, codeservice);
