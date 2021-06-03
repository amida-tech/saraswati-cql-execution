const codeservice = require('../data/codes/depression-screening-follow-up-codes');
const { execute } = require('./exec-template');
const measure = require('../json-elm/depression-screening.json');
//const patients = require('../data/patients/depression/depression-screening-follow-up.json');

const executeDepression= (patients) => {
    return execute(measure, patients, codeservice);
}

module.exports = { executeDepression };
