import Api from './app.js';
import express from 'express';
import { logger, config } from './config';

const app = express();
const api = new Api();

const start = async () => {
  await api.bootstrap(app);

  const server = app.listen(config.port, () => logger.info(`Express started. Listening on port ${config.port}`));

  const exitHandler = () => {
    if (server) {
      server.close(() => {
        logger.info('Server closed');
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  };

  const unexpectedErrorHandler = error => {
    logger.error(error);
    exitHandler();
  };

  process.on('uncaughtException', unexpectedErrorHandler);
  process.on('unhandledRejection', unexpectedErrorHandler);

  process.on('SIGTERM', () => {
    logger.info('SIGTERM received');

    if (server) server.close();
  });
};

start();
