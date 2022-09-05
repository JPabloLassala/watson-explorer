import autobind from 'es6-autobind';
import { createAssistant } from '../config';
import { getAssistantParams } from '../utils';

export class DialogNodeRepository {
  constructor() {
    autobind(this);
  }

  async getDialogNodeId({ country, env, nodeId }) {
    const assistant = createAssistant({ country, env });
    const params = getAssistantParams({ country, env }, { dialogNode: nodeId });

    const dialogNodes = await assistant.listDialogNodes(params);
    return dialogNodes.result;
  }

  async getDialogNodes({ country, env }) {
    const assistant = createAssistant({ country, env });
    const params = getAssistantParams({ country, env }, { pageLimit: 9999999 });
    const dialogNodes = await assistant.listDialogNodes(params);

    return dialogNodes.result.dialog_nodes;
  }

  async addNodesToSkill({ country, env, nodes }) {
    const assistant = createAssistant({ country, env });
    const params = getAssistantParams({ country, env }, { append: true, dialogNodes: nodes });

    const workspace = await assistant.updateWorkspace(params);

    return workspace;
  }
}
