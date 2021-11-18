const express = require('express');
const actuator = require('express-actuator');
const logger = require('./src/winston');

const watch = require('node-watch');
const axios = require('axios');
const config = require('./config');
const path = require('path');
const fs = require('fs');

const { executeDiabetes } = require('./exec-files/exec-cdc_diabetes-bp');
const { executeA1c } = require('./exec-files/exec-cdc_hba1c-lessThanEight');
const { executeNEWImmunization } = require('./exec-files/exec-new-cis');
const { executeDepression } = require('./exec-files/exec-depression-screening');
const { executeAsthma } = require('./exec-files/exec-medication-management-for-people-with-asthma');
const { executePPC } = require('./exec-files/exec-prenatal-postpartum-care');
const { executePreventable } = require('./exec-files/exec-preventable-complications');
const { executeChildWellVisit } = require('./exec-files/exec-childhood-well-visit');
const { executeReadmission } = require('./exec-files/exec-readmission');
const { executeOpioids } = require('./exec-files/exec-opioids');
const { executeDepressionRemission } = require('./exec-files/exec-drre');
const { executeColorectalCancer } = require('./exec-files/exec-colorectal-cancer');
const connectionUrl = `http://${config.host}:${config.port}/cql_service_connector`;

const a1cPath = path.normalize('data/patients/a1c');
const asthmaPath = path.normalize('data/patients/asthma');
const depressionPath = path.normalize('data/patients/depression');
const diabetesPath = path.normalize('data/patients/diabetes');
const immunizationPath = path.normalize('data/patients/immunization');
const ppcPath = path.normalize('data/patients/ppc');
const preventablePath = path.normalize('data/patients/preventable');
const childWellVisitPath = path.normalize('data/patients/child-well-care');
const readmissionPath = path.normalize('data/patients/readmission');
const opioidsPath = path.normalize('data/patients/opioids');
const depressionRemissionPath = path.normalize('data/patients/drre');
const colorectalCancerPath = path.normalize('data/patients/colorectal-cancer');

const watcher = dir =>
  watch(dir, (options = { recursive: true, filter: /\.json$/ }), function (event, filename) {
    logger.info(filename, event); // to know which file was processed
    fs.access('.' + path.normalize('/' + filename), (err) => {
      if (err){
        logger.info('File does not exists.');
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
              data = executeNEWImmunization(patients);
            } else if (filename.startsWith(ppcPath)) {
              data = executePPC(patients);
            } else if (filename.startsWith(preventablePath)) {
              data = executePreventable(patients);
            } else if (filename.startsWith(childWellVisitPath)) {
              data = executeChildWellVisit(patients);
            } else if (filename.startsWith(readmissionPath)) {
              data = executeReadmission(patients);
            } else if (filename.startsWith(opioidsPath)) {
              data = executeOpioids(patients);
            } else if (filename.startsWith(depressionRemissionPath)) {
              data = executeDepressionRemission(patients);
            } else if (filename.startsWith(colorectalCancerPath)) {
              data = executeColorectalCancer(patients);
            }
            if (data) {
              axios.post(connectionUrl, data).then(
                response => {
                  var result = response.data;
                  logger.info(result);
                },
                error => {
                  logger.error(error);
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

const app = express();
app.use(actuator()); // See https://github.com/amida-tech/mcp-ap-web/blob/00f4558c0b696f9239e4c2238b2d232b0e239e12/src/config/serverConfig.js

app.listen(config.actuatorPort, () => {
  logger.info(`Endpoint actuator listening at http://localhost:${config.actuatorPort}`);
});