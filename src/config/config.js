import dotenv from 'dotenv';
import Joi from 'joi';

dotenv.config();

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('dev', 'prod', 'local', 'test', 'qa', 'uat-wash', 'uat').required(),
    NODE_PORT: Joi.number().default(3000),
    MAIN_NODE_NAME: Joi.string().required(),
    TARGET_NODE_NAME: Joi.string().required(),
    WATSON_DESA_AR_ID: Joi.string().required(),
    WATSON_DESA_AR_KEY: Joi.string().required(),
    WATSON_DESA_CL_ID: Joi.string().required(),
    WATSON_DESA_CL_KEY: Joi.string().required(),
    WATSON_DESA_PE_ID: Joi.string().required(),
    WATSON_DESA_PE_KEY: Joi.string().required(),
    WATSON_DESA_CO_ID: Joi.string().required(),
    WATSON_DESA_CO_KEY: Joi.string().required(),
    WATSON_DESA_UY_ID: Joi.string().required(),
    WATSON_DESA_UY_KEY: Joi.string().required(),
    WATSON_DESA_EC_ID: Joi.string().required(),
    WATSON_DESA_EC_KEY: Joi.string().required(),
    WATSON_UAT_AR_ID: Joi.string().required(),
    WATSON_UAT_AR_KEY: Joi.string().required(),
    WATSON_UAT_CL_ID: Joi.string().required(),
    WATSON_UAT_CL_KEY: Joi.string().required(),
    WATSON_UAT_PE_ID: Joi.string().required(),
    WATSON_UAT_PE_KEY: Joi.string().required(),
    WATSON_UAT_CO_ID: Joi.string().required(),
    WATSON_UAT_CO_KEY: Joi.string().required(),
    WATSON_UAT_UY_ID: Joi.string().required(),
    WATSON_UAT_UY_KEY: Joi.string().required(),
    WATSON_UAT_EC_ID: Joi.string().required(),
    WATSON_UAT_EC_KEY: Joi.string().required(),
    WATSON_PROD_AR_ID: Joi.string().required(),
    WATSON_PROD_AR_KEY: Joi.string().required(),
    WATSON_PROD_CL_ID: Joi.string().required(),
    WATSON_PROD_CL_KEY: Joi.string().required(),
    WATSON_PROD_PE_ID: Joi.string().required(),
    WATSON_PROD_PE_KEY: Joi.string().required(),
    WATSON_PROD_CO_ID: Joi.string().required(),
    WATSON_PROD_CO_KEY: Joi.string().required(),
    WATSON_PROD_UY_ID: Joi.string().required(),
    WATSON_PROD_UY_KEY: Joi.string().required(),
    WATSON_PROD_EC_ID: Joi.string().required(),
    WATSON_PROD_EC_KEY: Joi.string().required(),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) throw new Error(`Config validation error: ${error.message}`);

export default {
  env: envVars.NODE_ENV,
  port: envVars.NODE_PORT,
  watson: {
    Url: envVars.WATSON_URL,
    ar: {
      desa: { id: envVars.WATSON_DESA_AR_ID, key: envVars.WATSON_DESA_AR_KEY },
      uat: { id: envVars.WATSON_UAT_AR_ID, key: envVars.WATSON_UAT_AR_KEY },
      prod: { id: envVars.WATSON_PROD_AR_ID, key: envVars.WATSON_PROD_AR_KEY },
    },
    cl: {
      desa: { id: envVars.WATSON_DESA_CL_ID, key: envVars.WATSON_DESA_CL_KEY },
      uat: { id: envVars.WATSON_UAT_CL_ID, key: envVars.WATSON_UAT_CL_KEY },
      prod: { id: envVars.WATSON_PROD_CL_ID, key: envVars.WATSON_PROD_CL_KEY },
    },
    pe: {
      desa: { id: envVars.WATSON_DESA_PE_ID, key: envVars.WATSON_DESA_PE_KEY },
      uat: { id: envVars.WATSON_UAT_PE_ID, key: envVars.WATSON_UAT_PE_KEY },
      prod: { id: envVars.WATSON_PROD_PE_ID, key: envVars.WATSON_PROD_PE_KEY },
    },
    co: {
      desa: { id: envVars.WATSON_DESA_CO_ID, key: envVars.WATSON_DESA_CO_KEY },
      uat: { id: envVars.WATSON_UAT_CO_ID, key: envVars.WATSON_UAT_CO_KEY },
      prod: { id: envVars.WATSON_PROD_CO_ID, key: envVars.WATSON_PROD_CO_KEY },
    },
    uy: {
      desa: { id: envVars.WATSON_DESA_UY_ID, key: envVars.WATSON_DESA_UY_KEY },
      uat: { id: envVars.WATSON_UAT_UY_ID, key: envVars.WATSON_UAT_UY_KEY },
      prod: { id: envVars.WATSON_PROD_UY_ID, key: envVars.WATSON_PROD_UY_KEY },
    },
    ec: {
      desa: { id: envVars.WATSON_DESA_EC_ID, key: envVars.WATSON_DESA_EC_KEY },
      uat: { id: envVars.WATSON_UAT_EC_ID, key: envVars.WATSON_UAT_EC_KEY },
      prod: { id: envVars.WATSON_PROD_EC_ID, key: envVars.WATSON_PROD_EC_KEY },
    },
    nodeNames: {
      source: envVars.MAIN_NODE_NAME,
      target: envVars.TARGET_NODE_NAME,
    },
  },
};
