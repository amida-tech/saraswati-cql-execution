const cql = require('../../src/cql');
const measure = require('./age.json');
const logger = require('../../src/winston')

const lib = new cql.Library(measure);
const executor = new cql.Executor(lib);
const psource = new cql.PatientSource([
  {
    id: '1',
    recordType: 'Patient',
    name: 'John Smith',
    gender: 'M',
    birthDate: '1980-02-17T06:15'
  },
  {
    id: '2',
    recordType: 'Patient',
    name: 'Sally Smith',
    gender: 'F',
    birthDate: '2007-08-02T11:47'
  }
]);

const result = executor.exec(psource);
logger.info(JSON.stringify(result, undefined, 2));
