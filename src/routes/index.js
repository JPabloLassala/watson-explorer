import { CreateConversationRoutes } from './conversation.routes';

const createRoutes = app => {
  CreateConversationRoutes(app);

  return app;
};

export { createRoutes };
