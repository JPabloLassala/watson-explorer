import autobind from 'es6-autobind';
import { DialogNodeService } from '../services';

export class DialogNodesController {
  constructor() {
    this.dialogNodeService = new DialogNodeService();
    autobind(this);
  }

  async handleGetNode(req, res) {
    const { country, env, id } = req.params;

    const dialogNode = await this.dialogNodeService.getDialogNode({ country, env, nodeId: id });

    return res.status(200).json(dialogNode);
  }

  async handleGetNodeWithChildren(req, res) {
    const { country, env } = req.params;
    const { name } = req.body;

    const dialogNodes = await this.dialogNodeService.getDialogNodeWithChildren({ country, env, name });

    return res.status(200).json(dialogNodes);
  }

  async handleCopyNodeWithChildren(req, res) {
    const { source, target, name } = req.body;
    const result = await this.dialogNodeService.copyDialogNodeWithChildren({ source, target, name });

    return res.status(200).json(result);
  }

  async handleFindNode(req, res) {
    const { country, env } = req.params;
    const { name } = req.body;

    const result = await this.dialogNodeService.findDialogNode({ country, env, name });

    return res.status(200).json(result);
  }

  handleGetEntity(req, res) {}

  handleMejoraContinua(req, res) {}
}
