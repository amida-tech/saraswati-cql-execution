const watch = require('node-watch');
const axios = require('axios')
const { executeDiabetes } = require('./exec-files/exec-cdc_diabetes-bp');
const { executeA1c } = require('./exec-files/exec-cdc_hba1c-lessThanEight');
const { executeImmunization } = require('./exec-files/exec-childhood-immunization-status');
const { executeDepression } = require('./exec-files/exec-depression-screening');
const { executeAsthma } = require('./exec-files/exec-medication-management-for-people-with-asthma');

  watch('data/patients/', options = {'recursive': true }, function (event, filename) {
    console.log(filename); // to know which file was processed
    const patients = require('./' + filename);
    if (patients) {
      var data;
      if (filename.startsWith("data/patients/a1c")) {
        data = executeA1c(patients)
      } else if (filename.startsWith("data/patients/asthma")) {
        data = executeAsthma(patients)
      }else if (filename.startsWith("data/patients/depression")) {
        data = executeDepression(patients)
      }else if (filename.startsWith("data/patients/diabetes")) {
        data = executeDiabetes(patients)
      }else if (filename.startsWith("data/patients/immunization")) {
        data = executeImmunization(patients)
      }
      axios.post('http://127.0.0.1:5000/cql_service_connector', data).then(
        (response) => {
            var result = response.data;
            console.log(result);
        },
        (error) => {
            console.log(error);
        }
    );
      
    }
  });