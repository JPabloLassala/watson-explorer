import autobind from 'es6-autobind';
import httpStatus from 'http-status';
import { DialogNodeService } from '../services';
import { WatsonNotFoundError } from '../utils';

export class DialogNodesController {
  constructor() {
    this.dialogNodeService = new DialogNodeService();
    autobind(this);
  }

  async handleGetNode(req, res) {
    const { country, env, id } = req.params;

    try {
      const dialogNode = await this.dialogNodeService.getDialogNode({ country, env, nodeId: id });

      return res.status(200).json(dialogNode);
    } catch (error) {
      if (error instanceof WatsonNotFoundError) {
        return res.status(httpStatus.NOT_FOUND).json({ message: error.message });
      }
    }
  }

  async handleGetNodeWithChildren(req, res) {
    const { country, env } = req.params;
    const { name } = req.body;

    try {
      const dialogNodes = await this.dialogNodeService.getDialogNodeWithChildren({ country, env, name });

      return res.status(200).json(dialogNodes);
    } catch (error) {
      if (error instanceof WatsonNotFoundError) {
        return res.status(httpStatus.NOT_FOUND).json({ message: error.message });
      }
    }
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
