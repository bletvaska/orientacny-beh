const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    DB_HOST: Joi.string().required().description('MYSQL DB host'),
    DB_USER: Joi.string().required().description('MYSQL DB user'),
    DB_PASSWORD: Joi.string().required().description('MYSQL DB password'),
    DB_DATABASE: Joi.string().required().description('MYSQL DB database'),
    RACE_CATEGORIES: Joi.string().required().description('Race categories'),
    RACE_ID: Joi.string().required().description('Race ID'),
    RACE_STAGE_ID: Joi.string().required().description('Race Stage ID'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mysql: {
    host: envVars.DB_HOST,
    user: envVars.DB_USER,
    password: envVars.DB_PASSWORD,
    database: envVars.DB_DATABASE,
  },
  race: {
    id: envVars.RACE_ID,
    stageId: envVars.RACE_STAGE_ID,
    categories: envVars.RACE_CATEGORIES
  }
};