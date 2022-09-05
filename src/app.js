import express from 'express';
import httpStatus from 'http-status';
import ApiError from './utils/ApiError.js';
import { createRoutes } from './routes';
import { errorConverter, errorHandler } from './middlewares/error.js';

export default class Api {
  async bootstrap(app) {
    // parse json request body
    app.use(express.json());

    // parse urlencoded request body
    app.use(express.urlencoded({ extended: true }));

    createRoutes(app);

    // send back a 404 error for any unknown api request
    app.use((req, res, next) => {
      next(new ApiError({ statusCode: httpStatus.NOT_FOUND, message: 'Not found' }));
    });

    // convert error to ApiError, if needed
    app.use(errorConverter);

    // handle error
    app.use(errorHandler);

    return app;
  }
}
