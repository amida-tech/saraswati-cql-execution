const Joi = require('joi');
const dotenv = require('dotenv');

if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: '.env.test' });
} else {
  dotenv.config();
}
// const what = dotenv.config();
// console.log("+++++++++++" + JSON.stringify(what));
// console.log("-----------" + JSON.stringify(process.env));

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
  DIR: Joi.string()
    .description('Directory to monitor'),
  ACTUATOR_PORT: Joi.string()
    .default('5001')
    .description('Port used for actuator endpoint'),
  KAFKA_BROKERS: Joi.string()
    .description('The Kafka queue server addresses to connect to. We will parse the entry afterwards.'),
  KAFKA_BROKER: Joi.string()
    .description('The Kafka primary queue server address to connect to.'),
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
    .description('The Kafka topic produced.')
}).unknown();

const { error, value: envVars } = envVarsSchema.validate(process.env, {convert: true});
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

let arrayDelimiter = ' ';
if (envVars.KAFKA_BROKERS.includes(', ')) {
  arrayDelimiter = ', ';
} else if (envVars.KAFKA_BROKERS.includes(',')) {
  arrayDelimiter = ',';
}

const config = {
  env: envVars.NODE_ENV,
  logLevel: envVars.LOG_LEVEL,
  host: envVars.SARASWATI_REPORTS_HOST,
  port: envVars.SARASWATI_REPORTS_PORT,
  directory: envVars.DIR,
  actuatorPort: envVars.ACTUATOR_PORT,
  kafkaBrokers: envVars.KAFKA_BROKERS.replace(/[["'\]]/g, '').split(arrayDelimiter),
  kafkaBroker: envVars.KAFKA_BROKER,
  kafkaUsername: envVars.KAFKA_USERNAME,
  kafkaPassword: envVars.KAFKA_PASSWORD,
  kafkaProtocol: envVars.KAFKA_PROTOCOL,
  kafkaMechanisms: envVars.KAFKA_MECHANISMS,
  kafkaGroupId: envVars.KAFKA_GROUP_ID,
  kafkaConsumedTopic: envVars.KAFKA_CONSUMED_TOPIC,
  kafkaProducedTopic: envVars.KAFKA_PRODUCED_TOPIC
};

console.log(">>>>>>" + JSON.stringify(config));

module.exports = config;