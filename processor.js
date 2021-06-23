const watch = require('node-watch');
const axios = require('axios');
const config = require('./config');
const path = require('path');
const fs = require('fs');

const { executeDiabetes } = require('./exec-files/exec-cdc_diabetes-bp');
const { executeA1c } = require('./exec-files/exec-cdc_hba1c-lessThanEight');
const { executeImmunization } = require('./exec-files/exec-childhood-immunization-status');
const { executeDepression } = require('./exec-files/exec-depression-screening');
const { executeAsthma } = require('./exec-files/exec-medication-management-for-people-with-asthma');
const { executeChildWellVisit } = require('./exec-files/exec-childhood-well-visit');
const connectionUrl = `http://${config.host}:${config.port}/cql_service_connector`;

const a1cPath = path.normalize('data/patients/a1c');
const asthmaPath = path.normalize('data/patients/asthma');
const depressionPath = path.normalize('data/patients/depression');
const diabetesPath = path.normalize('data/patients/diabetes');
const immunizationPath = path.normalize('data/patients/immunization');
const childWellVisitPath = path.normalize('data/patients/child-well-care');

const watcher = dir =>
  watch(dir, (options = { recursive: true, filter: /\.json$/ }), function (event, filename) {
    console.log(filename, event); // to know which file was processed
    fs.access('.' + path.normalize('/' + filename), (err) => {
      if (err){
        console.log("File does not exists.");
      } else {
        fs.readFile('.' + path.normalize('/' + filename), function (err, data) {
          if (err) throw err;
          let patients = JSON.parse(data);
          if (patients) {
            let data;
            if (filename.startsWith(a1cPath)) {
              data = executeA1c(patients);
            } else if (filename.startsWith(asthmaPath)) {
              data = executeAsthma(patients);
            } else if (filename.startsWith(depressionPath)) {
              data = executeDepression(patients);
            } else if (filename.startsWith(diabetesPath)) {
              data = executeDiabetes(patients);
            } else if (filename.startsWith(immunizationPath)) {
              data = executeImmunization(patients);
            } else if (filename.startsWith(childWellVisitPath)) {
              data = executeChildWellVisit(patients);
            }
            if (data) {
              axios.post(connectionUrl, data).then(
                response => {
                  var result = response.data;
                  console.log(result);
                },
                error => {
                  console.log(error);
                }
              );
            }
          }
        });
      }
  });
  });

watcher(config.directory);

module.exports = { watcher };
