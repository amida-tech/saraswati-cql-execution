const codeservice = require('../data/codes/medication-management-for-people-with-asthma-codes');
const { execute } = require('./exec-template');
const measure = require('../json-elm/medication-management-for-people-with-asthma.json');
//const patients = require('../data/patients/asthma/medication-management-for-people-with-asthma-patients.json');

const executeAsthma = (patients) => {
    return execute(measure, patients, codeservice);
}

module.exports = { executeAsthma };
