const fs = require('fs');

function measurementAccessCheck(envVars) {
  if(!fs.existsSync(envVars.MEASUREMENT_FILE)) {
    throw new Error(`Configuration validation error on Measures File: ${envVars.MEASUREMENT_FILE}`);
  }
  
  if(!fs.existsSync(envVars.LIBRARIES_DIRECTORY)) {
    throw new Error(`Configuration validation error on Libraries Directory: ${envVars.LIBRARIES_DIRECTORY}`);
  }
  
  if(!fs.existsSync(envVars.VALUESETS_DIRECTORY)) {
    throw new Error(`Configuration validation error on Value Sets Directory: ${envVars.VALUESETS_DIRECTORY}`);
  }
}

function getDelimiter(kafkaBrokers) {
  let arrayDelimiter = ' ';
  if (kafkaBrokers.includes(', ')) {
    arrayDelimiter = ', ';
  } else if (kafkaBrokers.includes(',')) {
    arrayDelimiter = ',';
  }
  return arrayDelimiter;
}

module.exports = {measurementAccessCheck, getDelimiter};