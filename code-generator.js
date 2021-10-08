/* eslint-disable no-console */

const parseArgs = require('minimist')(process.argv.slice(2));
const fs = require('fs');
const path = require('path');

if(parseArgs['dir'] === undefined) {
  console.log('Please define a directory path to read. Usage: "--dir=<directory>".');
  process.exit();
}

if(parseArgs['name'] === undefined) {
  console.log('Please define a name to output the file. The .js will be applied automatically. Usage: "--name=<codefile name>".');
  process.exit();
}

let codes = {};
const noTitle='No Title Found';
let noTitleNum = 0;
fs.readdir(parseArgs['dir'], function(readErr, files) {
  if (readErr) {
    console.error('\x1b[31m', 
      '\tError: Unable to scan directory:' + readErr + '.',
      '\x1b[0m');
    process.exit();
  }

  files.forEach(file => {
    console.log('\nProcessing ' + file + '...');

    if(!file.endsWith('.json')) {
      console.log('\tNote: Skipping ' + file + ' as it is not a .json file.');
      return;
    }

    let jsonFile = JSON.parse(fs.readFileSync(path.join(parseArgs['dir'], file)));
    if (!jsonFile.expansion || !jsonFile.expansion.contains) {
      console.error('\x1b[31m', 
        '\tError: No "expansion.contains" found. Skipping file but please investigate.',
        '\x1b[0m');
      return;
    }

    const contains = jsonFile.expansion.contains.map(container => {
      delete container.display;
      return container;
    });

    let title;
    if (jsonFile.title) {
      title=jsonFile.title;
    } else {
      console.warn('\x1b[33m', 
        '\tWarning: No "title" was found. Please manually update. Continuing with temp title "' + noTitle + noTitleNum + '".',
        '\x1b[0m');
      title = noTitle + noTitleNum;
      noTitleNum++;
    }
    
    let oidKey;
    if (jsonFile.url) {
      console.log('\tNote: Using url for oidKey.');
      oidKey = jsonFile.url;
    } else {
      console.warn('\x1b[33m',
        '\tNote: Using filename for oidKey.',
        '\x1b[0m');
      oidKey = 'http://www.ncqa.org/fhir/valueset/' + file.slice(0,-5);
    }

    codes[oidKey] = {
      [title]: contains
    };
  });

  const outputPath = path.join(parseArgs['dir'], parseArgs['name'] + '.js');
  console.log('\tProcessing of files complete. Saving to: ' + outputPath);
  const jsonOutput = 'const codes = ' + 
    JSON.stringify(codes, null, 2).replace(/"(\w+)"\s*:/g, '$1:').replace(/"/g,'\'') +
      ';\nmodule.exports = codes;';

  try {
    fs.writeFileSync(outputPath, jsonOutput);
  } catch (writeErr) {
    console.error('\x1b[31m', 
      '\tError: Unable to write to directory:' + writeErr + '.',
      '\x1b[0m');
  }
  console.log('\x1b[32m', 
    '\tSuccess: Please check the created file and update to export "const codes" of the created object.',
    '\x1b[0m');
});