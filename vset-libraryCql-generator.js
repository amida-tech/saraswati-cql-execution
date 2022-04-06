/* eslint-disable no-console */

const parseArgs = require('minimist')(process.argv.slice(2));
const fs = require('fs');
const readline = require('readline');
const path = require('path');

if(parseArgs['file'] === undefined) {
  console.error('\x1b[31m', 
    '\nError: Please define a file path to read. Usage: "--file=<directory>".',
    '\x1b[0m');
  process.exit();
}

const directory = path.join(path.dirname(parseArgs['file']), '..');
console.log('\nInfo: Directory to search for libraries and valuesets: ' + directory);

fs.stat(parseArgs['file'], function(readErr, stat) {
  if (readErr) {
    console.error('\x1b[31m', 
      '\n' + readErr + '.',
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
  let codeToUnion = '';
  let cqlFile = '';
  let appendLineCheck = true;

  for await (const line of rl) {
    if (line.startsWith('valueset')) { // If so, compile codes for entry later. This does not format them for CQL.
      processValueset(compiledCodes, line);
    }

    let newLine = '';
    if (line.includes('FHIRBase."VS Cast Function"')) {
      let filteredText = line.split('FHIRBase."VS Cast Function');
      
      if (filteredText.length === 1) {
        newLine = filteredText[0];
      } else {
        newLine = filteredText[1];
      }
      codeToUnion = newLine.substring(newLine.indexOf('("') + 2, newLine.indexOf('")'));
    }

    if (appendLineCheck) {
      if (codeToUnion === '') {
        const toSplit = 'FHIRBase."VS Cast Function"("' + codesToUnion[0] + '")';
        const splitLine = line.split(toSplit);
        cqlFile += `\n` + splitLine[0] + `List {\n    System.Code {\n` + processCqlAppend(compiledCodes, codeToUnion) + splitLine[1];
        codeToUnion = '';
      } else { 
      cqlFile += `\n${line}`;
      } 
    }
  }

  const outputPath = path.join(directory, 'cql', 'Amida_' + path.basename(parseArgs['file']));

  try {
    fs.writeFileSync(outputPath, cqlFile);
  } catch (writeErr) {
    console.error('\x1b[31m', 
      '\nError: Unable to write to directory:' + writeErr + '.',
      '\x1b[0m');
    process.exit();
  }
  console.log('\x1b[32m', 
    '\nSuccess: Please check the created file at: ' + outputPath,
    '\x1b[0m');
}

function processValueset(compiledCodes, line) {
  const valuesetName = line.split('"')[1];
  const valuesetFile = line.split('/').pop().slice(0, -1) + '.json';
  let valuesetJson = JSON.parse(fs.readFileSync(path.join(directory, 'valuesets', valuesetFile)));
  if (!valuesetJson?.expansion?.contains) {
    console.error('\x1b[31m', 
      '\nError: No "expansion.contains" found. Aborting.',
      '\x1b[0m');
    process.exit();
  }
  compiledCodes[valuesetName] = valuesetJson.expansion.contains.map(container => {
    delete container.display;
    delete container.version;
    return container;
  });
}

function processCqlAppend(compiledCodes, codeToUnion) {
  let cqlAppend = '';
  compiledCodes[codeToUnion].forEach(codeEntry => {
    cqlAppend += `      code: \'${codeEntry.code}\',\n`
    cqlAppend += `      system: \'${codeEntry.system}\'\n`
    cqlAppend += '    }, System.Code {\n'
  });
  return cqlAppend.slice(0, -18) + ` }\n}\n`;
}
