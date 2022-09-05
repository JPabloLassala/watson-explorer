import { config } from '../config';

export const getAssistantParams = ({ country, env }, params) => ({
  workspaceId: config.watson[country][env].id,
  ...params,
});
