const codeservice = require('../data/codes/well-child-visits-15-mos-codes');
const { execute } = require('./exec-template');
const measure = require('../json-elm/well-child-visits-15-mos.json');
//const patients = require('../data/patients/immunization/childhood-immunization-status-patients.json');

const executeChildWellVisit = (patients) => {
    return execute(measure, patients, codeservice);
}

module.exports = { executeChildWellVisit };