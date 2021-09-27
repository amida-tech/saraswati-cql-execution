const { configuredFormatter } = require('winston-json-formatter');
const { logLevel } = require('kafkajs');
const winston = require('winston');
const pjson = require('../package.json');
const config = require('../config');

const toWinstonLogLevel = level => {
  switch(level) {
    case logLevel.ERROR:
    case logLevel.NOTHING:
      return 'error';
    case logLevel.WARN:
      return 'warn';
    case logLevel.INFO:
      return 'info';
    case logLevel.DEBUG:
      return 'debug';
  }
};

const ProdWinstonLogCreator = (loggedLevel) => {
    const logger = winston.createLogger({
      level: toWinstonLogLevel(loggedLevel),
      transports: [
        new winston.transports.Console(),
        // new winston.transports.File({ filename: 'myapp.log' })
      ]
    });

    const options = { 
      service: 'saraswati-cql-execution',
      logger: 'application-logger',
      version: pjson.version
    };
  
    logger.format = configuredFormatter(options);

    return LogResult(logger);
}

const DevWinstonLogCreator = (loggedLevel) => {
  const logger = winston.createLogger({
    level: toWinstonLogLevel(loggedLevel),
    transports: [
      new winston.transports.Console({
        format: winston.format.simple()
      }),
      // new winston.transports.File({ filename: 'myapp.log' })
    ]
  });

  return LogResult(logger);
}

const LogResult = (logger) => {
  return ({ namespace, level, label, log }) => {
    const { message, ...extra } = log; 
    logger.log({
      level: toWinstonLogLevel(level),
      message,
      extra,
    });
  }
}

module.exports = config.env === 'production' ? ProdWinstonLogCreator : DevWinstonLogCreator;