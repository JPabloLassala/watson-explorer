import Joi from 'joi';
import { Countries, Environments } from '../constants';

export const getNodeValidation = {
  params: Joi.object().keys({
    country: Joi.string()
      .required()
      .valid(...Countries)
      .description('Skill country'),
    env: Joi.string()
      .required()
      .valid(...Environments)
      .description('Skill environment'),
    id: Joi.string().required().description('Dialog node ID'),
  }),
};

export const getNodeWithChildrenValidation = {
  params: Joi.object().keys({
    country: Joi.string()
      .required()
      .valid(...Countries)
      .description('Skill country'),
    env: Joi.string()
      .required()
      .valid(...Environments)
      .description('Skill environment'),
  }),
  body: Joi.object().keys({
    name: Joi.string().required().description('Dialog node name'),
  }),
};

export const copyNodeWithChildrenValidation = {
  body: Joi.object().keys({
    name: Joi.string().required().description('Dialog node name'),
    source: Joi.object().keys({
      country: Joi.string()
        .required()
        .lowercase()
        .valid(...Countries)
        .description('Source country for skill'),
      env: Joi.string()
        .required()
        .lowercase()
        .valid(...Environments)
        .description('Skill environment'),
    }),
    target: Joi.object().keys({
      country: Joi.string()
        .required()
        .lowercase()
        .valid(...Countries)
        .description('Source country for skill'),
      env: Joi.string()
        .required()
        .lowercase()
        .valid(...Environments)
        .description('Skill environment'),
    }),
  }),
};

export const getNodeTreeValidation = {
  params: Joi.object().keys({
    country: Joi.string()
      .required()
      .lowercase()
      .valid(...Countries)
      .description('Skill country'),
    env: Joi.string()
      .required()
      .lowercase()
      .valid(...Environments)
      .description('Skill environment'),
  }),
};

export const findNodeValidation = {
  params: Joi.object().keys({
    country: Joi.string()
      .required()
      .lowercase()
      .valid(...Countries)
      .description('Skill country'),
    env: Joi.string()
      .required()
      .lowercase()
      .valid(...Environments)
      .description('Skill environment'),
  }),
  body: Joi.object().keys({
    name: Joi.string().required().lowercase().description('Node name'),
  }),
};
