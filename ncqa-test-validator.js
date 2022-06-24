const minimist = require('minimist');
const fs = require('fs');
const readline = require('readline');
const path = require('node:path');
const config = require('./config');
const { execute } = require('./exec-files/exec-config');
const { createProviderList } = require('./src/utilities/providerUtil');

let scorePath;

const parseArgs = minimist(process.argv.slice(2), {
  alias: {
    f: 'fhirDirectory',
    v: 'validate',
  },
});

function checkArgs() {
  if(parseArgs.f === undefined) {
    console.error('\x1b[31m', 
      '\nError: Please define a directory path with FHIR data to validate. Usage: "--fhirDirectory=<directory>".',
      '\x1b[0m');
    process.exit();
  }

  if(parseArgs.v === true) {
    scorePath = path.join(parseArgs.f, '..');
    console.log(`\nChecking above path for "score.txt".`);
    if (fs.existsSync(scorePath)) {
      console.log(`\x1b[32mSuccess:\x1b[0m Found "score.txt".`);
    } else {
      console.error('\x1b[31m', 
      '\nError:File not found "score.txt" in the folder above. Please fix.',
      '\x1b[0m');
      process.exit();
    }
  }

  console.log('Running with config options:');
  console.log(`\tMeasurement File: ${config.measurementFile}`);
  console.log(`\tLibraries: ${config.librariesDirectory}`);
  console.log(`\tValue Sets: ${config.valuesetsDirectory}`);
  console.log(`\tMeasurement: ${config.measurementType}`);
}

const evalData = (patient) => {
  const data = execute(patient);

  const memberId = Object.keys(data).find((key) => key.toLowerCase() !== 'timestamp');
  const patientData = data[memberId];
  const entryList = Array.isArray(patient) ? patient[0].entry : patient.entry;
  const patientInfo = entryList.find((results) => results.resource.resourceType === 'Patient')
    .resource;

  data['memberId'] = memberId;
  data['birthDate'] = patientInfo.birthDate;
  data['gender'] = patientInfo.gender;
  data['measurementType'] = config.measurementType;
  data['coverage'] = patientData['Member Coverage'];
  data['providers'] = createProviderList(patient);
  return data;
};

function verifyData() {
  checkArgs();
}


if (parseArgs.h === true) {
  console.log('\n A script for generating HEDIS scores and verifying results. You must config ".env" settings, and run "ncqa-test-converter.js" first.\n\n Options:');
  console.log('   -f, --fhirDirectory: The directory of FHIR data you want to score and verify.');
  console.log('   -v, --validate: Optional. If true, compare against the `score.txt` file in the folder above FHIR directory. Outputs "score-amida.txt". Defaults to "false".');
  process.exit();
}

verifyData();