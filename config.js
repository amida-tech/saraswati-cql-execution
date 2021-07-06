const Joi = require('joi');
const dotenv = require('dotenv');

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
  DIR: Joi.string()
    .description('Directory to monitor'),
}).unknown();

const { error, value: envVars } = envVarsSchema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  logLevel: envVars.LOG_LEVEL,
  host: envVars.SARASWATI_REPORTS_HOST,
  port: envVars.SARASWATI_REPORTS_PORT,
  directory: envVars.DIR
};

module.exports = config;