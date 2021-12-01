
const should = require('should');
const { cleanData } = require('../exec-files/exec-config');
const cisData = require('./data/cisData.json');
const cisResults = require('./data/cisResults.json');
const hba1cData = require('./data/hba1cData.json');
const hba1cResults = require('./data/hba1cResults.json');

describe('cleanData should return non-array and non-patient expression data', () => {
  it('CIS data is cleaned', () => {
    should(cleanData(cisData)).deepEqual(cisResults);
  });

  it('HbA1c data is cleaned', () => {
    should(cleanData(hba1cData)).deepEqual(hba1cResults);
  });
});

