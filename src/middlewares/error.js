import httpStatus from 'http-status';
import config from '../config/config.js';
import logger from '../config/logger.js';
import ApiError from '../utils/ApiError.js';
import { Environments } from '../constants';

const errorConverter = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || httpStatus[statusCode];
    error = new ApiError({ statusCode: statusCode, message: message, entity: false, stack: err.stack });
  }

  next(error);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let { statusCode: code, message } = err;

  if (config.env === Environments.production && !err.isOperational) {
    code = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }

  res.locals.errorMessage = err.message;

  const response = {
    code: code,
    message,
    ...(config.env === Environments.development && { stack: err.stack }),
  };

  if (config.env === Environments.development) logger.error(err);

  logger.error(`Request status ${code} | Message: ${message}`);

  res.status(code).send(response);
};

export { errorConverter, errorHandler };
