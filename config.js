const Joi = require('joi');
const dotenv = require('dotenv');
const util = require('./src/config-util');
const path = require('path');

dotenv.config();

const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow('development', 'production', 'test', 'provision')
    .default('production')
    .description('Environment of processor service'),
  LOG_LEVEL: Joi.string()
    .default('info')
    .description('Log level of processor service'),
  SARASWATI_REPORTS_HOST: Joi.string()
    .description('Host to make post call to saraswati-reports'),
  SARASWATI_REPORTS_PORT: Joi.number()
    .default(5000)
    .description('Port to make post call to saraswati-reports, defaults to 5000'),
  ACTUATOR_PORT: Joi.string()
    .default('5001')
    .description('Port used for actuator endpoint'),
  KAFKA_BROKERS: Joi.string()
    .description('The Kafka queue server addresses to connect to. We will parse the entry afterwards.'),
  KAFKA_USERNAME: Joi.string()
    .default('username1')
    .description('The SASL username for accessing the Kafka queue.'),
  KAFKA_PASSWORD: Joi.string()
    .default('k@Fka3sk')
    .description('The SASL password for accessing the Kafka queue.'),
  KAFKA_PROTOCOL: Joi.string()
    .default('sasl_ssl')
    .allow('plaintext', 'sasl_plaintext', 'sasl_ssl', 'ssl')
    .description('The security protocol for accessing the Kafka queue.'),
  KAFKA_MECHANISMS: Joi.string()
    .description('The SASL mechanism for accessing the Kafka queue.'),
  KAFKA_GROUP_ID: Joi.string()
    .default('saraswati')
    .description('The Kafka group ids.'),
  KAFKA_CONSUMED_TOPIC: Joi.string()
    .default('fhir-logged')
    .description('The Kafka topic consumed.'),
  KAFKA_PRODUCED_TOPIC: Joi.string()
    .default('hedis-measures')
    .description('The Kafka topic produced.'),
  MEASUREMENT_YEAR: Joi.string()
    .default('2022')
    .description('The year for which the measure is evaluated'),
  JENKINS: Joi.boolean()
    .default(false)
    .description('If this is running in Jenkins or not'),
  MEASUREMENT_FILE: Joi.string()
    .description('Location of the measure. File only.')
    .required(),
  LIBRARIES_DIRECTORY: Joi.string()
    .description('Location of the libraries. Directory only.')
    .required(),
  VALUESETS_DIRECTORY: Joi.string()
    .description('Location of the value sets. Directory only.')
    .required(),
  MEASUREMENT_TYPE: Joi.string()
    .description('The measurement type. Used to mark the resulting scores. When running `"localread"' +
      'in development mode, it will check the matching `"data/patients/"` folder.')
    .required()
}).unknown();

const { error, value: envVars } = envVarsSchema.validate(process.env, {convert: true});
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

// cross-env doesn't seem to be handling this. Open to ideas to improve. 
envVars.MEASUREMENT_FILE = envVars.MEASUREMENT_FILE.split(/[\\|/]/).join(path.sep);
envVars.LIBRARIES_DIRECTORY = envVars.LIBRARIES_DIRECTORY.split(/[\\|/]/).join(path.sep);
envVars.VALUESETS_DIRECTORY = envVars.VALUESETS_DIRECTORY.split(/[\\|/]/).join(path.sep);

util.measurementAccessCheck(envVars);
const arrayDelimiter = util.getDelimiter(envVars.KAFKA_BROKERS);

const config = {
  env: envVars.NODE_ENV,
  logLevel: envVars.LOG_LEVEL,
  host: envVars.SARASWATI_REPORTS_HOST,
  port: envVars.SARASWATI_REPORTS_PORT,
  directory: envVars.DIR,
  actuatorPort: envVars.ACTUATOR_PORT,
  kafkaBrokers: envVars.KAFKA_BROKERS.replace(/[["'\]]/g, '').split(arrayDelimiter),
  kafkaUsername: envVars.KAFKA_USERNAME,
  kafkaPassword: envVars.KAFKA_PASSWORD,
  kafkaProtocol: envVars.KAFKA_PROTOCOL,
  kafkaMechanisms: envVars.KAFKA_MECHANISMS,
  kafkaGroupId: envVars.KAFKA_GROUP_ID,
  kafkaConsumedTopic: envVars.KAFKA_CONSUMED_TOPIC,
  kafkaProducedTopic: envVars.KAFKA_PRODUCED_TOPIC,
  measurementYear: envVars.MEASUREMENT_YEAR,
  measurementFile: envVars.MEASUREMENT_FILE,
  librariesDirectory: envVars.LIBRARIES_DIRECTORY,
  valuesetsDirectory: envVars.VALUESETS_DIRECTORY,
  measurementType: envVars.MEASUREMENT_TYPE,
  jenkins: envVars.JENKINS
};

module.exports = config;