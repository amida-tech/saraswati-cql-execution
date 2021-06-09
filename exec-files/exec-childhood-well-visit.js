const codeservice = require('../data/codes/childhood-immunization-status-codes');
const { execute } = require('./exec-template');
const measure = require('../json-elm/child-well-care-patients.json');
//const patients = require('../data/patients/immunization/childhood-immunization-status-patients.json');

const executeChildWellVisit = (patients) => {
    return execute(measure, patients, codeservice);
}

module.exports = { executeChildWellVisit };
