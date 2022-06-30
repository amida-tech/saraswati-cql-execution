const minimist = require('minimist');
const fs = require('fs');
const path = require('path');
const config = require('./config');
const { execute } = require('./exec-files/exec-config');
const { createProviderList } = require('./src/utilities/providerUtil');
const { getAge, getContinuousEnrollment, getEligiblePopulation, getEvent, getNumerator, getRequiredExclusion, hedisData, getExclusion } = require('./ncqa-test-validator-util');

let basePath;
let scorePath;
let scoreAmidaPath;
let measuresPath;
const hedisEocHeaders = "MemID,Meas,Payer,CE,Event,Epop,Excl,Num,RExcl,RExclD,Age,Gender\n";
// Different, future headers maybe added.

const parseArgs = minimist(process.argv.slice(2), {
  alias: {
    f: 'fhirDirectory',
    v: 'validate',
  },
});

async function checkArgs() {
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

async function createMeasureDirectory() {
  fs.mkdir(measuresPath, { recursive: true }, (mkdirErr) => {
    if (mkdirErr) {
      console.error(`\x1b[31m\nError: Failure to make measures directory, ${mkdirErr}.\x1b[0m`);
      process.exit();
    }
  });
}

async function createScoreFile() {
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

async function appendScoreFile(data) {
  const memberId = data.memberId.split('-')[0]; // Works.
  const gender = data.gender === 'male' ? 'M' : 'F'; // Works.
  hedisData[config.measurementType].measureIds.forEach((measureId, index) => {
    if (hedisData[config.measurementType].measureCheck(data, index)) {
      const ce = hedisData[config.measurementType].getContinuousEnrollment(data, index);
      const event = hedisData[config.measurementType].getEvent(data, index);
      const excl = hedisData[config.measurementType].getExclusion(data, index);//getExclusion(data, index)
      const num = hedisData[config.measurementType].getNumerator(data, index); //getNumerator(data, index);
      const rExcl = hedisData[config.measurementType].getRequiredExclusion(data, index);//getRequiredExclusion(data, index); // Required exclusion.
      const rExclD = hedisData[config.measurementType].getRequiredExclusionID(data, index); // Data Element Required Exclusions.
      const age = hedisData[config.measurementType].getAge(data, index); 
      const ePop = getEligiblePopulation(ce, event, rExcl, rExclD);

      const payerSet = new Set();
      data[data.memberId]['Member Coverage'].forEach((coverage) => {
        coverage.payor.forEach((payor) => {
          payerSet.add(payor.reference.value);
        })
      });

      payerSet.forEach((payer) => {
        const row = `${memberId},${measureId},${payer},${ce},${event},${ePop},${excl},${num},${rExcl},${rExclD},${age},${gender}\n`;
        fs.appendFileSync(scoreAmidaPath, row, appendScoreErr => {
          if (appendScoreErr) {
            console.error(`\x1b[31m\nError: Failure to read FHIR directory, ${fhirDirErr}.\x1b[0m`);
            process.exit();
          }
        });
      });
    }
  })
}

async function getFhirDirectoryFiles() {
  return fs.readdirSync(parseArgs.f, (fhirDirErr, dirFiles) => {
    if(fhirDirErr) {
      console.error(`\x1b[31m\nError: Failure to read FHIR directory, ${fhirDirErr}.\x1b[0m`);
      process.exit();
    }
    return dirFiles;
  })
}

async function processFhirDirectory(dirFiles) {
  const filenames = dirFiles.map((file) => parseInt(file.split('.')[0], 10)).sort((a, b) => a - b);
  for (let file of filenames) {
    if (file === '.DS_Store') {
      continue;
    }
    console.log(`Processing ${file}.json.`);
    const fileData = await fs.promises.readFile(path.join(parseArgs.f, `${file}.json`));
    const memberData = evalData(JSON.parse(fileData));
    const fileTitle = `${config.measurementType}-${memberData.memberId}.json`;
    fs.writeFileSync(path.join(measuresPath, fileTitle), JSON.stringify(memberData, null, 2));
    appendScoreFile(memberData);
  }
}

const verifyData = async() => {
  await checkArgs();
  const dirFiles = await getFhirDirectoryFiles();
  await createMeasureDirectory();
  await createScoreFile();
  await processFhirDirectory(dirFiles);
}

if (parseArgs.h === true) {
  console.log('\n A script for generating HEDIS scores and verifying results. You must config ".env" settings, and run "ncqa-test-converter.js" first.\n\n Options:');
  console.log('   -f, --fhirDirectory: The directory of FHIR data you want to score and verify.');
  console.log('   -v, --validate: Optional. If true, compare against the `score.txt` file in the folder above FHIR directory. Outputs "score-amida.txt". Defaults to "false".');
  process.exit();
}

verifyData();