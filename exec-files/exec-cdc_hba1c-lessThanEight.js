const codeservice = require('../data/codes/cdc_hba1c-codes');
const { execute } = require('./exec-template');
const measure = require('../json-elm/cdc_hba1c-lessThanEight.json');
// const patients = require('../data/patients/a1c/cdc_hba1c-patients.json');

const executeA1c = (patients) => {
    return execute(measure, patients, codeservice);
}

module.exports = { executeA1c };
