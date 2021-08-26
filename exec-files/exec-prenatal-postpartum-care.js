const codeservice = require('../data/codes/ppc-codes');
const { execute } = require('./exec-template');
const measure = require('../json-elm/prenatal-postpartum-care.json');
// const patients = require('../data/patients/ppc/prenatal-postpartum-care-patients.json');

const executePPC = (patients) => {
    return execute(measure, patients, codeservice);
}

module.exports = { executePPC };