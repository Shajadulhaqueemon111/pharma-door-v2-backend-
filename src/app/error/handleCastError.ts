import mongoose from 'mongoose';
import { TErrorSources, TGenericErrorResponse } from '../interface/errorType';
//zodError Handeller
const handlerCastError = (
  err: mongoose.Error.CastError,
): TGenericErrorResponse => {
  const errrorSources: TErrorSources = [
    {
      path: err.path,
      message: err.message,
    },
  ];
  const statusCode = 400;
  return {
    statusCode,
    message: 'Invalid ID',
    errrorSources,
  };
};

export default handlerCastError;
