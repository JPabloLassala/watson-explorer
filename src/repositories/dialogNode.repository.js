import autobind from 'es6-autobind';
import { createAssistant } from '../config';
import { errorMessages } from '../constants';
import { getAssistantParams, NodeListNotFoundError, NodeNotFoundError, WatsonError } from '../utils';

export class DialogNodeRepository {
  constructor() {
    autobind(this);
  }

  async getDialogNodeId({ country, env, nodeId }, assistant = null) {
    assistant = assistant || createAssistant({ country, env });
    try {
      const params = getAssistantParams({ country, env }, { dialogNode: nodeId });

      const dialogNodes = await assistant.getDialogNode(params);
      return dialogNodes.result;
    } catch (error) {
      if (error?.code === 404) {
        throw new NodeNotFoundError({ country, env, nodeId });
      }
    }
  }

  async getDialogNodes({ country, env }) {
    try {
      const assistant = createAssistant({ country, env });
      const params = getAssistantParams({ country, env }, { pageLimit: 9999999 });
      const dialogNodes = await assistant.listDialogNodes(params);

      return dialogNodes.result.dialog_nodes;
    } catch (error) {
      if (error?.code === 404) {
        throw new NodeListNotFoundError({ country, env });
      }
    }
  }

  async addNodesToSkill({ country, env, nodes }) {
    try {
      const assistant = createAssistant({ country, env });
      const params = getAssistantParams({ country, env }, { append: true, dialogNodes: nodes });

      const workspace = await assistant.updateWorkspace(params);

      return workspace;
    } catch (error) {
      throw new WatsonError(errorMessages.cannotUpdate);
    }
  }
}
