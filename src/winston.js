const { configuredFormatter } = require('winston-json-formatter');

const {createLogger, transports, format } = require('winston');
const pjson = require('../package.json');
const config = require('../config');

let logger;
if (config.env === 'production') {
  logger = createLogger({ 
    level: config.logLevel,
    transports: [new transports.Console()]
  });

  const options = { 
    service: 'saraswati-cql-execution',
    logger: 'application-logger',
    version: pjson.version
  };

  logger.format = configuredFormatter(options);
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