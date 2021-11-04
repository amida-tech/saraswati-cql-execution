const codeservice = require('../data/codes/col-cancer-codes');
const { execute } = require('./exec-template');
const measure = require('../json-elm/col-cancer.json');

const executeColorectalCancer = (patients) => {
  return execute(measure, patients, codeservice);
};

module.exports = { executeColorectalCancer };