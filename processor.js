const express = require('express');
const actuator = require('express-actuator');
const logger = require('./src/winston');

const watch = require('node-watch');
const axios = require('axios');
const config = require('./config');
const path = require('path');
const fs = require('fs');

const { execute } = require('./exec-files/exec-config');
const connectionUrl = `http://${config.host}:${config.port}/cql_service_connector`;

const watcher = dir =>
  watch(dir, (options = { recursive: true, filter: /\.json$/ }), function (event, filename) {
    logger.info(filename, event); // to know which file was processed
    fs.access('.' + path.normalize('/' + filename), (err) => {
      if (err) {
        logger.info('File does not exists.');
      } else {
        let send = false;
        fs.readFile('.' + path.normalize('/' + filename), function (fileReadErr, data) {
          if (fileReadErr) throw fileReadErr;
          let patient = JSON.parse(data);
          if (patient) {
            if (filename.startsWith(path.join('data', 'patients', config.measurementType))) {
              data = execute(patient);
              data['memberId'] = Object.keys(data).find((key) => key.toLowerCase() !== 'timestamp');
              data['measurementType'] = config.measurementType;
              send = true;
            } else {
              logger.info('Wrong folder changed.');
            }
            if (send) {
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

watcher(path.join('data', 'patients'));

module.exports = { watcher };

const app = express();
app.use(actuator()); // See https://github.com/amida-tech/mcp-ap-web/blob/00f4558c0b696f9239e4c2238b2d232b0e239e12/src/config/serverConfig.js

app.listen(config.actuatorPort, () => {
  logger.info(`Endpoint actuator listening at http://localhost:${config.actuatorPort}`);
});