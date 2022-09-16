import autobind from 'es6-autobind';
import { AsciiTree } from 'oo-ascii-tree';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config';
import { DialogNodeRepository } from '../repositories';
import { NodeListNotFoundError, NodeNameNotFoundError } from '../utils';

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

    if (targetNode === []) {
      throw new NodeListNotFoundError({ country, env });
    }

    return targetNode;
  }

  async getDialogNodeWithChildren({ country, env, name }) {
    let resultNodes = [];
    let carryingIds = [];

    const nodeList = await this.dialogNodeRepository.getDialogNodes({ country, env });
    const mainNode = this.getMainNode({ nodeList, country, env });

    const parentNodeRes = nodeList.filter(node => node.parent === mainNode.dialog_node && node.title === name);

    if (parentNodeRes === []) {
      throw new NodeNameNotFoundError({ env, country, name });
    }

    const parentNode = [parentNodeRes];
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

  async getDialogNodeTree({ country, env, name }) {
    let resultNodes = [];
    let carryingIds = [];
    const nodesTree = {};

    const nodeList = await this.dialogNodeRepository.getDialogNodes({ country, env });
    const mainNode = this.getMainNode(nodeList);

    if (!mainNode) return false;

    const [parentNode] = nodeList.filter(node => node.parent === mainNode.dialog_node && node.title === name);
    resultNodes = [parentNode];
    carryingIds = [parentNode.dialog_node];
    nodesTree[parentNode.dialog_node] = new AsciiTree(parentNode.title);

    while (carryingIds.length) {
      const nodes = nodeList.filter(node => carryingIds.includes(node.parent));
      const nodesIds = nodes.map(n => n.dialog_node);

      nodes.forEach(node => {
        const nodeTree = new AsciiTree(node.title);
        nodesTree[node.dialog_node] = nodeTree;
        nodesTree[node.parent].add(nodeTree);
      });

      resultNodes = [...resultNodes, ...nodes];
      carryingIds = nodesIds;
    }

    return nodesTree[parentNode.dialog_node];
  }

  getMainNode({ nodeList, country, env }) {
    const res = nodeList.filter(node => node?.title?.includes(config.watson.nodeNames.source));

    if (res === []) {
      throw new NodeNameNotFoundError({ env, country, name: config.watson.nodeNames.source });
    }

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
