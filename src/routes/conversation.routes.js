import express from 'express';
import { DialogNodesController } from '../controllers';
import { validate } from '../middlewares';
import {
  copyNodeWithChildrenValidation,
  getNodeTreeValidation,
  getNodeValidation,
  getNodeWithChildrenValidation,
} from '../validations';

const router = express.Router();

const CreateConversationRoutes = app => {
  const dialogNodesController = new DialogNodesController();
  const {
    handleGetNode,
    handleGetNodeWithChildren,
    handleCopyNodeWithChildren,
    handleFindNode,
    handleGetEntity,
    handleMejoraContinua,
    handleGetNodeTree,
  } = dialogNodesController;

  app.use('/', router);

  router.get('/getNode/:country/:env/:id', validate(getNodeValidation), handleGetNode);
  router.post('/getNodeWithChildren/:country/:env', validate(getNodeWithChildrenValidation), handleGetNodeWithChildren);
  router.post('/copyNodeWithChildren/', validate(copyNodeWithChildrenValidation), handleCopyNodeWithChildren);
  router.post('/getNodeTree/:country/:env', validate(getNodeTreeValidation), handleGetNodeTree);
  router.post('/findNode/:country/:env', handleFindNode);
  router.get('/getEntity/:country/:env/:name', handleGetEntity);
  router.post('/mejoraContinua/:country', handleMejoraContinua);

  return router;
};

export { CreateConversationRoutes };
