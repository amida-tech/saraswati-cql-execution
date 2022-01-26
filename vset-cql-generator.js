/* eslint-disable no-console */

const parseArgs = require('minimist')(process.argv.slice(2));
const fs = require('fs');
const readline = require('readline');
const path = require('path');

if(parseArgs['file'] === undefined) {
  console.log('Please define a file path to read. Usage: "--file=<directory>".');
  process.exit();
}

const directory = path.join(path.dirname(parseArgs['file']), '..');
console.log('Directory to search for libraries and valuesets: ' + directory);

fs.stat(parseArgs['file'], function(readErr, stat) {
  if (readErr) {
    console.error('\x1b[31m', 
      '\tError: Unable to read file:' + readErr + '.',
      '\x1b[0m');
    process.exit();
  }

  processLines();
});

async function processLines() {
  const filestream = fs.createReadStream(parseArgs['file']);
  const rl = readline.createInterface({
    input: filestream,
    crlfDelay: Infinity
  });

  let compiledCodes = {}; // A precompiled list of codes to append.
  let codesToUnion = [];
  let cqlFile = '';

  for await (const line of rl) {
    if (line.startsWith('valueset')) { // If so, compile codes for entry later. This does not format them for CQL.
      const valuesetName = line.split('"')[1];
      const valuesetFile = line.split('/').pop().slice(0, -1) + '.json';
      let valuesetJson = JSON.parse(fs.readFileSync(path.join(directory, 'valuesets', valuesetFile)));
      if (!valuesetJson?.expansion?.contains) {
        console.error('\x1b[31m', 
          '\tError: No "expansion.contains" found. Aborting.',
          '\x1b[0m');
        process.exit();
      }
      compiledCodes[valuesetName] = valuesetJson.expansion.contains.map(container => {
        delete container.display;
        delete container.version;
        return container;
      });

    }

    if (line.startsWith('  FHIRBase."VS Cast Function"')) {
      codesToUnion.push(line.substring(line.indexOf('( "') + 3, line.indexOf('" )')));
      // Compile the codes you'll need but do not write yet.
    }
    if (line.startsWith('    union FHIRBase."VS Cast Function"')) {
      codesToUnion.push(line.substring(line.indexOf('( "') + 3, line.indexOf('" )')));
      // Append more codes to the existing list.
    } else {
      cqlFile += `\n${line}`;
      // Write the codes.
      codesToUnion = [];
    }
  }
  
  console.log(cqlFile);
}
