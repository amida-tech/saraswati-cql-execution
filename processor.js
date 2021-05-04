const watch = require('node-watch');
const axios = require('axios');
const config = require('./config');
const { executeDiabetes } = require('./exec-files/exec-cdc_diabetes-bp');
const { executeA1c } = require('./exec-files/exec-cdc_hba1c-lessThanEight');
const { executeImmunization } = require('./exec-files/exec-childhood-immunization-status');
const { executeDepression } = require('./exec-files/exec-depression-screening');
const { executeAsthma } = require('./exec-files/exec-medication-management-for-people-with-asthma');
const connectionUrl = `http://${config.host}:${config.port}/cql_service_connector`;


const watcher = (dir) => watch(dir, options = { 'recursive': true }, function (event, filename) {
  console.log(filename); // to know which file was processed
  const patients = require('./' + filename);
  if (patients) {
    let data;
    if (filename.startsWith("data/patients/a1c")) {
      data = executeA1c(patients)
    } else if (filename.startsWith("data/patients/asthma")) {
      data = executeAsthma(patients)
    } else if (filename.startsWith("data/patients/depression")) {
      data = executeDepression(patients)
    } else if (filename.startsWith("data/patients/diabetes")) {
      data = executeDiabetes(patients)
    } else if (filename.startsWith("data/patients/immunization")) {
      data = executeImmunization(patients)
    }
    if (data) {
      axios.post(connectionUrl, data).then(
        (response) => {
          var result = response.data;
          console.log(result);
        },
        (error) => {
          console.log(error);
        }
      );
    }

  }
});

watcher(config.directory);

module.exports = { watcher };

