const cron = require("node-cron");
const path = require('path');
const fs = require('fs');
const http = require('http');
const net = require("net");
const { executeDiabetes } = require('./exec-files/exec-cdc_diabetes-bp');
const { executeA1c } = require('./exec-files/exec-cdc_hba1c-lessThanEight');
const { executeImmunization } = require('./exec-files/exec-childhood-immunization-status');
const { executeDepression } = require('./exec-files/exec-depression-screening');
const { executeAsthma } = require('./exec-files/exec-medication-management-for-people-with-asthma');

// const server = new net.Server()
// server.listen({ host: "127.0.0.1", port: 3000 })
// server.on("connection", client => {
//   const directory = path.join(__dirname, 'data/patients');

//   fs.watch(directory, options = { 'persistent': true,'recursive': true }, function (event, filename) {
//     console.log(filename);
//     const patients = require('./data/patients/' + filename);
//     if (patients) {
//       if (filename.startsWith("a1c")) {
//         client.write(executeA1c(patients))
//       } else if (filename.startsWith("asthma")) {
//         client.write(executeAsthma(patients))
//       }else if (filename.startsWith("depression")) {
//         client.write(executeDepression(patients))
//       }else if (filename.startsWith("diabetes")) {
//         client.write(executeDiabetes(patients))
//       }else if (filename.startsWith("immunization")) {
//         client.write(executeImmunization(patients))
//       }
//     }
//   });
// })

var watch = require('node-watch');
const axios = require('axios')
  const directory = path.join(__dirname, 'data/patients');
  watch('data/patients/', options = {'recursive': true }, function (event, filename) {
    console.log(filename);
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
//   function makePostRequest(path, queryObj) {
//     axios.post(path, queryObj)//.then(
//     //     (response) => {
//     //         var result = response.data;
//     //         console.log(result);
//     //     },
//     //     (error) => {
//     //         console.log(error);
//     //     }
//     // );
// }
  
// queryObj = { name: 'Chitddrank' };
// makePostRequest('http://127.0.0.1:3000/sms', queryObj);





/* This is without the use of fs.watch */
// cron.schedule("*/5 * * * * *", () => {
//     const directory = path.join(__dirname, 'data/patients');

//     fs.readdir(directory, (err, files) => {
//         files.forEach(file => {
//           if (fs.lstatSync(path.resolve(directory, file)).isDirectory()) {
//             if (file == "diabetes"){
//                 fs.watch(directory + "/" + file, function(event, sfile) {
//                     fs.readdirSync(directory + "/" + file, (err, f) => {
//                         f.forEach(function (file1) {
//                             if (!(listOfFiles.includes(file1))) {
//                                 const patients = require('./data/patients/' + file + '/' + file1);
//                                 executeDiabetes(patients)
//                                 listOfFiles.push(file1);
//                             }
//                         });
//                     });
//                 });
//             }
//             if (file == "a1c"){
//                 fs.readdir(directory + "/" + file, (error, sfile) =>{
//                     sfile.forEach(function (file1) {
//                         if (!listOfFiles.includes(file1)) {
//                             const patients = require('./data/patients/' + file + '/' + file1);
//                             executeA1c(patients)
//                             listOfFiles.push(file1);
//                         }
//                     });
//                 });
//             }
//             if (file == "immunization"){
//                 fs.readdir(directory + "/" + file, (error, sfile) =>{
//                     sfile.forEach(function (file1) {
//                         if (!listOfFiles.includes(file1)) {
//                             const patients = require('./data/patients/' + file + '/' + file1);
//                             executeImmunization(patients)
//                             listOfFiles.push(file1);
//                         }
//                     });
//                 });
//             }
//             if (file == "depression"){
//                 fs.readdir(directory + "/" + file, (error, sfile) =>{
//                     sfile.forEach(function (file1) {
//                         if (!listOfFiles.includes(file1)) {
//                             const patients = require('./data/patients/' + file + '/' + file1);
//                             executeDepression(patients)
//                             listOfFiles.push(file1);
//                         }
//                     });
//                 });
//             }
//             if (file == "asthma"){
//                 fs.readdir(directory + "/" + file, (error, sfile) =>{
//                     sfile.forEach(function (file1) {
//                         if (!listOfFiles.includes(file1)) {
//                             const patients = require('./data/patients/' + file + '/' + file1);
//                             executeAsthma(patients)
//                             listOfFiles.push(file1);
//                         }
//                     });
//                 });
//             }
//           } else {
//             console.log('File: ' + file);
//           }
//         });
//       });
// });
