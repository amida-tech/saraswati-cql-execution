const minimist = require('minimist');
const fs = require('fs');
const readline = require('readline');
const path = require('node:path');
const config = require('./config');
const { execute } = require('./exec-files/exec-config');
const { createProviderList } = require('./src/utilities/providerUtil');

let basePath;
let scorePath;
let scoreAmidaPath;
let measuresPath;
const msInAYear = 1000 * 60 * 60 * 24 * 365;
const hedisEocHeaders = "MemID,Meas,Payer,CE,Event,Epop,Excl,Num,RExcl,RExclD,Age,Gender\n";
// Different, future headers maybe added.

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

  
  basePath = path.join(parseArgs.f, '..');
  measuresPath = path.join(basePath, 'measures');
  scoreAmidaPath = path.join(basePath, 'score-amida.txt');

  if(parseArgs.v === true) {
    scorePath = path.join(basePath, 'score.txt');
    console.log(`\nChecking above path for "score.txt".`);
    if (fs.existsSync(path.join(basePath, 'score.txt'))) {
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

function createMeasureDirectory() {
  fs.mkdir(measuresPath, { recursive: true }, (mkdirErr) => {
    if (mkdirErr) {
      console.error(`\x1b[31m\nError: Failure to make measures directory, ${mkdirErr}.\x1b[0m`);
      process.exit();
    }
  });
}

function createScoreFile() {
  if(fs.existsSync(scoreAmidaPath)) {
    fs.unlink(scoreAmidaPath, (deleteScoreErr) => {
      if (deleteScoreErr) {
        console.error(`\x1b[31m\nError: Could not delete old "score-amida.txt", ${deleteScoreErr}.\x1b[0m`);
        process.exit();
      }
    });
  }
  fs.writeFile(scoreAmidaPath, hedisEocHeaders, createScoreErr => {
      if (createScoreErr) {
        console.error(`\x1b[31m\nError: Failure to write "score-amida.txt", ${createScoreErr}.\x1b[0m`);
        process.exit();
      }
    });
}

function getAge(date) {
  const ageInMilliseconds = new Date() - new Date(date);
  return Math.floor(ageInMilliseconds / msInAYear);
}

function appendScoreFile(data) {
  const memberId = data.memberId.split('-')[0];
  const measureId = '???'; // These are by-measure changes. Requires logic table.
  const payer = data[data.memberId]['Member Coverage'][0].payor[0].reference.value;
  const ce = '???'; // Continuous enrollment.
  const event = '???';
  const ePop = '???';
  const excl = '???';
  const num = '???';
  const rExcl = '???'; // Required exclusion.
  const rExclD = '???'; // Data Element Required Exclusions.
  const age = getAge(new Date(data.birthDate)); 
  const gender = data.gender === 'male' ? 'M' : 'F';

  const row = `${memberId},${measureId},${payer},${ce},${event},${ePop},${excl},${num},${rExcl},${rExclD},${age},${gender}\n`;
  fs.appendFile(scoreAmidaPath, row, appendScoreErr => {
    if (appendScoreErr) {
      console.error(`\x1b[31m\nError: Failure to read FHIR directory, ${fhirDirErr}.\x1b[0m`);
      process.exit();
    }
  });
}

function verifyData() {
  checkArgs();
  fs.readdir(parseArgs.f, (fhirDirErr, files) => {
    if(fhirDirErr) {
      console.error(`\x1b[31m\nError: Failure to read FHIR directory, ${fhirDirErr}.\x1b[0m`);
      process.exit();
    }
    createMeasureDirectory();
    createScoreFile();
    files.forEach(file => {
      fs.readFile(path.join(parseArgs.f, file), 'utf8', function(readFileErr, data) {
        if(readFileErr) {
          console.error(`\x1b[31m\nError: Failure to read FHIR file, ${readFileErr}.\x1b[0m`);
          process.exit();
        }
        const memberData = evalData(JSON.parse(data));
        const fileTitle = `${config.measurementType}-${memberData.memberId}.json`;
        fs.writeFileSync(path.join(measuresPath, fileTitle), JSON.stringify(memberData, null, 4));
        appendScoreFile(memberData);
      });
      
    });
  });
}

if (parseArgs.h === true) {
  console.log('\n A script for generating HEDIS scores and verifying results. You must config ".env" settings, and run "ncqa-test-converter.js" first.\n\n Options:');
  console.log('   -f, --fhirDirectory: The directory of FHIR data you want to score and verify.');
  console.log('   -v, --validate: Optional. If true, compare against the `score.txt` file in the folder above FHIR directory. Outputs "score-amida.txt". Defaults to "false".');
  process.exit();
}

verifyData();