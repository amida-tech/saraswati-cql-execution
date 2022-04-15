const should = require('should');
const path = require('path');
const util = require('../src/config-util');

const discoveredFile = path.join('test', 'valuesets', 'exec-config-no-compose.json');
const envVars = {
  MEASUREMENT_FILE: discoveredFile,
  LIBRARIES_DIRECTORY: discoveredFile,
  VALUESETS_DIRECTORY: discoveredFile
};

describe ('config-util tests', () => {
  beforeEach(() => {
    envVars.MEASUREMENT_FILE = discoveredFile;
    envVars.LIBRARIES_DIRECTORY = discoveredFile;
    envVars.VALUESETS_DIRECTORY = discoveredFile;
  });

  describe('measurementAccessCheck', () => {
    it('should throw error if MEASUREMENT_FILE not found', () => {
      envVars.MEASUREMENT_FILE = path.join('test', 'valuesets', 'nope.json');
      try {
        util.measurementAccessCheck(envVars);
      } catch (error) {
        should(error.message.includes('on Measures File')).be.true();
        return;
      }
      should.fail();
    });

    it('should throw error if LIBRARIES_DIRECTORY not found', () => {
      envVars.LIBRARIES_DIRECTORY = path.join('test', 'valuesets', 'nope.json');
      try {
        util.measurementAccessCheck(envVars);
      } catch (error) {
        should(error.message.includes('on Libraries Directory')).be.true();
        return;
      }
      should.fail();
    });

    
    it('should throw error if VALUESETS_DIRECTORY not found', () => {
      envVars.VALUESETS_DIRECTORY = path.join('test', 'valuesets', 'nope.json');
      try {
        util.measurementAccessCheck(envVars);
      } catch (error) {
        should(error.message.includes('on Value Sets Directory')).be.true();
        return;
      }
      should.fail();
    });
  });

  describe('getDelimiter', () => {
    it('should return just a comma for unspaced lists of brokers', () => {
      const result = util.getDelimiter('what,ev,er');
      should(result).equal(',');
    });
  });
});