const codeservice = require('../data/codes/depression-screening-follow-up-codes');
const { execute } = require('./exec-template');
const measure = require('../json-elm/depression-screening.json');
const patients = require('../data/patients/depression-screening-follow-up.json');

execute(measure, patients, codeservice);
