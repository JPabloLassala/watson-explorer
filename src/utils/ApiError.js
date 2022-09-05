export default class ApiError extends Error {
  constructor({ statusCode, message, entity, isOperational = true, stack = '', reason, response = {} }) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.entity = entity;
    this.reason = reason;
    this.response = response;

    if (stack) this.stack = stack;
    else Error.captureStackTrace(this, this.constructor);
  }
}
