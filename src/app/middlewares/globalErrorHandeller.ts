/* eslint-disable @typescript-eslint/no-unused-vars */
import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';

import { ZodError, ZodIssue } from 'zod';
import { TErrorSources } from '../interface/errorType';

import handlerCastError from '../error/handleCastError';
import AppError from '../error/app.error';
import config from '../config';
import handlerZodError from '../error/handleZoderror';
import handleMongooseValidationError from '../error/handleMongooseErrorhandler';

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next): void => {
  let statusCode = err?.statusCode || 500;
  let message = err?.message || 'Something went wrong!';

  //errrorSources handeling functino
  let errrorSources: TErrorSources = [
    {
      path: '',
      message: 'something went wrong',
    },
  ];

  //zod error identify instanceof checking

  if (err instanceof ZodError) {
    const simplifiedError = handlerZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errrorSources = simplifiedError?.errrorSources;
  } else if (err?.name == 'ValidationError') {
    const simplifiedError = handleMongooseValidationError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errrorSources = simplifiedError?.errrorSources;
  } else if (err?.name === 'CastError') {
    const simplifiedError = handlerCastError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errrorSources = simplifiedError?.errrorSources;
  } else if (err instanceof AppError) {
    statusCode = err?.statusCode;
    message = err.message;
    errrorSources = [
      {
        path: '',
        message: err?.message,
      },
    ];
  } else if (err instanceof Error) {
    message = err.message;
    errrorSources = [
      {
        path: '',
        message: err?.message,
      },
    ];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errrorSources,

    err: config.NODE_ENV == 'development' ? err?.stack : null, //development environment ar somay satck use kora jabe karon exact error bojar jonn but production ar somay stack tula dita hoba securityr jonnu
  });
};

export default globalErrorHandler;
//
