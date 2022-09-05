import AssistantV1 from 'ibm-watson/assistant/v1';
import { IamAuthenticator } from 'ibm-watson/auth';
import config from './config';

export const createAssistant = ({ country, env }) => {
  return new AssistantV1({
    version: '2021-11-27',
    serviceUrl: config.watson.Url,
    authenticator: new IamAuthenticator({
      apikey: config.watson[country][env].key,
    }),
  });
};
