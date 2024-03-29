const { configuredFormatter } = require('winston-json-formatter');

const {createLogger, transports, format } = require('winston');
const pjson = require('../package.json');
const config = require('../config');

const options = { 
  service: 'saraswati-cql-execution',
  logger: 'application-logger',
  version: pjson.version
};

let logger;
if (config.env === 'production') {
  logger = createLogger({ 
    level: config.logLevel,
    format: configuredFormatter(options),
    transports: [new transports.Console()]
  });
} else {
  logger = createLogger({
    transports: [
      // new transports.File({
      //   json: false,
      //   filename:'log.log'
      // }),
      new transports.Console({
        format: format.simple(),
      })
    ],
  });
}

module.exports = logger;