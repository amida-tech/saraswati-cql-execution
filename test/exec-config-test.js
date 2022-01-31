
const should = require('should');
const rewire = require('rewire');
const config = require('../config');
const execConfig = rewire('../exec-files/exec-config');
const cisData = require('./data/cisData.json');
const cisResults = require('./data/cisResults.json');
const hba1cData = require('./data/hba1cData.json');
const hba1cResults = require('./data/hba1cResults.json');

const oldConfig = Object.assign({}, config);

describe('exec-config tests', () => {
  beforeEach(() => {
    config.measurementType = oldConfig.measurementType;
    config.measurementFile = oldConfig.measurementFile;
    config.librariesDirectory = oldConfig.librariesDirectory;
    config.valuesetsDirectory = oldConfig.valuesetsDirectory;
  });

  describe('cleanData should return non-array and non-patient expression data', () => {
    it('CIS data is cleaned', () => {
      should(execConfig.cleanData(cisData)).deepEqual(cisResults);
    });

    it('HbA1c data is cleaned', () => {
      should(execConfig.cleanData(hba1cData)).deepEqual(hba1cResults);
    });
  });

  describe('valueSetJSONCompile should compile an object of value sets from JSON files', () => {
    it('should return a blank value set because the supplied JSON has no "expansion.contains"', () => {
      config.valuesetsDirectory = 'test/valuesets';
      execConfig.__set__('valueSets', {});
      execConfig.valueSetJSONCompile('exec-config-no-compose.json');
      should(Object.keys(execConfig.__get__('valueSets')).length).equal(0);
    });

    it('should use default title filename for the oidKey', () => {
      config.valuesetsDirectory = 'test/valuesets';
      execConfig.__set__('valueSets', {});
      execConfig.valueSetJSONCompile('exec-config-no-title-or-url.json');
      const results = execConfig.__get__('valueSets');
      should(Object.keys(results)[0])
        .equal('https://www.ncqa.org/fhir/valueset/exec-config-no-title-or-url');
      should(Object.keys(results['https://www.ncqa.org/fhir/valueset/exec-config-no-title-or-url'])[0])
        .equal('No Title Found');
    });
  });
});
