const { cleanData } = require('../../exec-files/exec-template');
const cisData = require('../data/cisData.json');
const cisResults = require('../data/cisResults.json');
const hba1cData = require('../data/hba1cData.json');
const hba1cResults = require('../data/hba1cResults.json');

describe('return non-array and non-patient expression data', () => {
  it('CIS data is cleaned', () => {
    cleanData(cisData).should.deepEqual(cisResults);
  });

  it('HbA1c data is cleaned', () => {
    cleanData(hba1cData).should.deepEqual(hba1cResults);
  });
});