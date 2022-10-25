const minimist = require('minimist');
const fs = require('fs');
const path = require('path');
const config = require('./config');
const { execute, supportExecute } = require('./exec-files/exec-config');
const { createProviderList } = require('./src/utilities/providerUtil');
const { getEligiblePopulation, ethnicityMap, raceEthnicDSMap, hedisData } = require('./ncqa-test-validator-util');
const logger = require('./src/winston');
const saraswatiVersion = require('./package.json').version;

const measure = config.measurementType;

let basePath;
let scorePath;
let scoreAmidaPath;
let measuresPath;
const raceHeaders= ',Race,Ethnicity,RaceDS,EthnicityDS';
const hedisEocHeaders = `MemID,Meas,Payer,CE,Event,Epop,Excl,Num,RExcl,RExclD,Age,Gender${hedisData[measure].raceRequired ? raceHeaders : '' }\n`;
// Different, future headers maybe added.

const parseArgs = minimist(process.argv.slice(2), {
  alias: {
    f: 'fhirDirectory',
    m: 'memberIds',
    b: 'beginWith',
    e: 'endWith',
    o: 'outFile',
    v: 'validate',
    s: 'skipEval',
  },
});

async function checkArgs() {
  if(parseArgs.f === undefined) {
    logger.error('\x1b[31m', 
      '\nError: Please define a directory path with FHIR data to validate. Usage: "--fhirDirectory=<directory>".',
      '\x1b[0m');
    process.exit();
  }

  basePath = path.join(parseArgs.f, '..');
  measuresPath = path.join(basePath, 'measures');
  scoreAmidaPath = path.join(basePath, parseArgs.o !== undefined ? parseArgs.o : 'score-amida.txt');

  if(parseArgs.v === true) {
    scorePath = path.join(basePath, 'score.txt');
    logger.info(`\nChecking above path for "score.txt".`);
    if (fs.existsSync(path.join(basePath, 'score.txt'))) {
      logger.info(`\x1b[32mSuccess:\x1b[0m Found "score.txt".`);
    } else {
      logger.error('\x1b[31m', 
      '\nError:File not found "score.txt" in the folder above. Please fix.',
      '\x1b[0m');
      process.exit();
    }
  }

  logger.info('Running with config options:');
  logger.info(`\tMeasurement File: ${config.measurementFile}`);
  logger.info(`\tLibraries: ${config.librariesDirectory}`);
  logger.info(`\tValue Sets: ${config.valuesetsDirectory}`);
  logger.info(`\tMeasurement: ${measure}`);
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
  data['measurementType'] = measure;
  data['coverage'] = patientData['Member Coverage'];
  data['providers'] = createProviderList(patient);
  data['version'] = saraswatiVersion;
  
  if (config.supportFile) {
    data['support'] = supportExecute(patient);
  }

  if(hedisData[measure].raceRequired) {
    patientInfo.extension.forEach((ext) => {
      const code = ext.extension[0].valueCoding;
      data[code < 10 ? 'race' : 'ethnicity'] = code;
    });
    patientInfo.meta.extension.forEach((ext) => {
      data[ext.url] = ext.valueString;
    });
  }
  return data;
};

async function createMeasureDirectory() {
  fs.mkdir(measuresPath, { recursive: true }, (mkdirErr) => {
    if (mkdirErr) {
      logger.error(`\x1b[31m\nError: Failure to make measures directory, ${mkdirErr}.\x1b[0m`);
      process.exit();
    }
  });
}

async function createScoreFile() {
  if(fs.existsSync(scoreAmidaPath)) {
    fs.unlink(scoreAmidaPath, (deleteScoreErr) => {
      if (deleteScoreErr) {
        logger.error(`\x1b[31m\nError: Could not delete old "score-amida.txt", ${deleteScoreErr}.\x1b[0m`);
        process.exit();
      }
    });
  }
  fs.writeFile(scoreAmidaPath, hedisEocHeaders, createScoreErr => {
      if (createScoreErr) {
        logger.error(`\x1b[31m\nError: Failure to write "score-amida.txt", ${createScoreErr}.\x1b[0m`);
        process.exit();
      }
    });
}

async function appendScoreFile(data) {
  const memberId = data.memberId.split('-')[0]; // Works.
  const gender = data.gender === 'male' ? 'M' : 'F'; // Works.
  let raceRow = '';
  if (hedisData[measure].raceRequired) {
    raceRow = `,${data.race},${ethnicityMap[data.ethnicity]},${raceEthnicDSMap[data.raceDS]},${raceEthnicDSMap[data.ethnicityDS]}`
  }
  hedisData[measure].measureIds.forEach((measureId, index) => {
    if (hedisData[measure].measureCheck(data, index, hedisData[measure])) {
      const ce = hedisData[measure].getContinuousEnrollment(data, index, hedisData[measure]);
      const event = hedisData[measure].getEvent(data, index, hedisData[measure]);
      const excl = hedisData[measure].getExclusion(data, index);
      const num = hedisData[measure].getNumerator(data, index, hedisData[measure]);
      const rExcl = hedisData[measure].getRequiredExclusion(data, index, hedisData[measure]);// Required exclusion.
      const rExclD = hedisData[measure].getRequiredExclusionID(data, index, hedisData[measure]); // Data Element Required Exclusions.
      const age = hedisData[measure].getAge(data, index, hedisData[measure]);

      let ePop = getEligiblePopulation(ce, event, rExcl, rExclD);
      if (ePop && typeof hedisData[measure].getEligiblePopulation === 'function') {
        ePop = hedisData[measure].getEligiblePopulation(data, index, hedisData[measure]);
      }

      const payors = hedisData[measure].getPayors(data, index, hedisData[measure]);

      payors.forEach((payer) => {
        const row = `${memberId},${measureId},${payer},${ce},${event},${ePop},${excl},${num},${rExcl},${rExclD},${age},${gender}${raceRow}\n`;
        fs.appendFileSync(scoreAmidaPath, `${row}`, appendScoreErr => {
          if (appendScoreErr) {
            logger.error(`\x1b[31m\nError: Failure to read FHIR directory, ${fhirDirErr}.\x1b[0m`);
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
      logger.error(`\x1b[31m\nError: Failure to read FHIR directory, ${fhirDirErr}.\x1b[0m`);
      process.exit();
    }
    return dirFiles;
  })
}

async function processFhirDirectory(dirFiles) {
  let filenames = dirFiles
    .filter((file) => file !== '.DS_Store')
    .map((file) => parseInt(file.split('.')[0], 10)).sort((a, b) => a - b);
  if (parseArgs.b !== undefined) {
    const memberId = parseInt(parseArgs.b, 10);
    filenames = filenames.filter((file) => parseInt(file) >= memberId);
  }
  if (parseArgs.e !== undefined) {
    const memberId = parseInt(parseArgs.e, 10);
    filenames = filenames.filter((file) => parseInt(file) <= memberId);
  }
   if (parseArgs.m !== undefined) {
    const memberIds = parseArgs.m.toString().split(',').map((memberId) => parseInt(memberId, 10));
    filenames = filenames.filter((file) => memberIds.includes(file));
  }
  for (let file of filenames) {
    logger.info(`Processing ${file}.json.`);
    let memberData = '';
    if (parseArgs.s) {
      memberData = JSON.parse(await fs.promises.readFile(path.join(measuresPath, `${measure}-${file}-patient.json`)));
    } else {
      const fileData = await fs.promises.readFile(path.join(parseArgs.f, `${file}.json`));
      memberData = evalData(JSON.parse(fileData));
      const fileTitle = `${measure}-${memberData.memberId}.json`;
      fs.writeFileSync(path.join(measuresPath, fileTitle), JSON.stringify(memberData, null, 2));
    }
    
    appendScoreFile(memberData); //JAMES KEITH
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
  logger.info('\n A script for generating HEDIS scores and verifying results. You must config ".env" settings, and run "ncqa-test-converter.js" first.\n\n Options:');
  logger.info('   -f, --fhirDirectory: The directory of FHIR data you want to score and verify.');
  logger.info('   -m, --memberIds: A comma separated list of memberIds you want to compute. Optional.');
  logger.info('   -b, --beginWith: A number for which member ID the script will start with. Optional.');
  logger.info('   -e, --endWith: A number for which member ID the script will end with. Optional.');
  logger.info('   -o, --outputFile: The file to store the results. Optional but recommended when using -b and -e.');
  logger.info('   -v, --validate: Optional. If true, compare against the `score.txt` file in the folder above FHIR directory. Outputs "score-amida.txt". Defaults to "false".');
  logger.info('   -s, --skipEval: Optional. If true, it will not run CQL execution. It will use the previously generated json output.')
  process.exit();
}

verifyData();
