const minimist = require('minimist');
const fs = require('fs');
const readline = require('readline');
const path = require('path');
const logger = require('./src/winston');

const providerKeys = ['pcp','obgyn','mhProvider','eyeCareProvider','dentist','nephrologist','anesthesiologist','nprProvider',
  'pasProvider','prescriber','clinicalPharm','hospital','snf','surgeon','regNurse'];

const parseArgs = minimist(process.argv.slice(2), {
  alias: {
    f: 'file',
    h: 'help',
    n: 'name',
  },
});

const checkArgs = () => {
  if(parseArgs.f === undefined) {
    logger.error('\x1b[31m', 
      '\nError: Please define a file to convert into a provider privileges file.',
      '\x1b[0m');
    process.exit();
  }
}

const extractValue = (line, start, length) => {
  return line.substring(start - 1, start + length - 1).trim()
}

const readFile = async (file) => {
  return readline.createInterface({
    input: fs.createReadStream(file),
    crlfDelay: Infinity
  });
}

const generateProviders = async () => {
  const providers = {};
  const fileLines = await readFile(parseArgs.f);
  for await (const text of fileLines) {
    const providerId = extractValue(text, 1, 10);
    providers[providerId] = {};
    let textSpot = 11;
    providerKeys.forEach((key) => {
      providers[providerId][key] = extractValue(text, textSpot, 1) === 'Y' ? true : false;
      textSpot +=1;
    });
  }
  return providers;
}

const writeProvidersFile = (providers) => {
  let fileName = 'ncqa-test-provider.json';
  if (parseArgs.n !== undefined) {
    fileName = `${parseArgs.n}.json`;
  }
  fs.writeFile(path.join(__dirname, fileName), JSON.stringify(providers, null, 2), createProvidersErr => {
    if (createProvidersErr) {
      logger.error(`\x1b[31m\nError: Failure to writing to "score-amida.txt", ${createProvidersErr}.\x1b[0m`);
      process.exit();
    }
  });
}

const processProviders = async () => {
  checkArgs();
  const providers = await generateProviders();
  await writeProvidersFile(providers);
}

if (parseArgs.h === true) {
  logger.info('\n A script for turning provider.txt files into JSON objects.\n\n Options:');
  logger.info('   -f, --file: The file you want to convert. Default name is "ncqa-test-provider.json".');
  logger.info('   -n, --name: Optional. The name you want for the output file. Currently only useful for IMA-E.');
  process.exit();
}

processProviders()