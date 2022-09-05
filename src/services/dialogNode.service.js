import autobind from 'es6-autobind';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config';
import { DialogNodeRepository } from '../repositories';

export class DialogNodeService {
  constructor() {
    this.dialogNodeRepository = new DialogNodeRepository();
    autobind(this);
  }

  async getDialogNode({ country, env, nodeId }) {
    const result = await this.dialogNodeRepository.getDialogNodeId({ country, env, nodeId });

    return result;
  }

  async findDialogNode({ country, env, name }) {
    const nodeList = await this.dialogNodeRepository.getDialogNodes({ country, env });
    const targetNode = nodeList.find(n => n?.title === name);

    return targetNode;
  }

  async getDialogNodeWithChildren({ country, env, name }) {
    let resultNodes = [];
    let carryingIds = [];

    const nodeList = await this.dialogNodeRepository.getDialogNodes({ country, env });
    const mainNode = this.getMainNode(nodeList);

    const [parentNode] = nodeList.filter(node => node.parent === mainNode.dialog_node && node.title === name);
    resultNodes = [parentNode];
    carryingIds = [parentNode.dialog_node];

    while (carryingIds.length) {
      const nodes = nodeList.filter(node => carryingIds.includes(node.parent));
      const nodesIds = nodes.map(n => n.dialog_node);

      resultNodes = [...resultNodes, ...nodes];
      carryingIds = nodesIds;
    }

    const trimmedNodes = this.removeExternalJumps(resultNodes);
    const renamedNodes = this.renameIds(trimmedNodes);

    return renamedNodes;
  }

  async copyDialogNodeWithChildren({ source, target, name }) {
    const sourceNodes = await this.getDialogNodeWithChildren({ ...source, name });
    const trimmedNodes = this.removeExternalJumps(sourceNodes);
    const nodesWithNewIds = this.renameIds(trimmedNodes);
    const nodeListWithTargetParent = await this.getNodeListWithNewParent({ nodeList: nodesWithNewIds, target, name });
    const renamedNodes = await this.replaceSuffixToNodes({ nodeList: nodeListWithTargetParent, country: target.country });
    const result = await this.dialogNodeRepository.addNodesToSkill({ ...target, nodes: renamedNodes });

    return result;
  }

  getMainNode(nodeList) {
    const [res] = nodeList.filter(node => node.title === config.watson.nodeNames.source);

    return res;
  }

  removeExternalJumps(nodeList) {
    const internalNodeIds = nodeList.map(n => n.dialog_node);
    return nodeList.map(n => {
      if (n?.next_step?.dialog_node && !internalNodeIds.includes(n.next_step.dialog_node)) {
        delete n.next_step;
      }
      if (n?.previous_sibling && !internalNodeIds.includes(n.previous_sibling)) {
        delete n.previous_sibling;
      }

      return n;
    });
  }

  renameIds(nodeList) {
    const nodeIdList = {};
    nodeList.forEach(n => (nodeIdList[n.dialog_node] = `node_api_${uuidv4().replaceAll('-', '')}`));
    return nodeList.map(n => {
      n.dialog_node = nodeIdList[n.dialog_node];
      if (Object.keys(nodeIdList).includes(n.parent)) {
        n.parent = nodeIdList[n.parent];
      }
      if (n.next_step) {
        n.next_step.dialog_node = nodeIdList[n.next_step.dialog_node];
      }
      if (n.previous_sibling) {
        n.previous_sibling = nodeIdList[n.previous_sibling];
      }

      return n;
    });
  }

  async getNodeListWithNewParent({ nodeList, target, name }) {
    const targetNode = await this.findDialogNode({ ...target, name: config.watson.nodeNames.target });

    return nodeList.map(n => {
      if (n.title === name) n.parent = targetNode.dialog_node;

      return n;
    });
  }

  replaceSuffixToNodes({ nodeList, country }) {
    return nodeList.map(n => {
      if (n?.title.match(/^.*_[A-Z]{2}[0-9]{3}$/)) {
        n.title = n.title.replace(/^(.*_)[A-Z]{2}([0-9]{3})$/, `$1${country.toUpperCase()}$2`);
      }

      return n;
    });
  }
}
