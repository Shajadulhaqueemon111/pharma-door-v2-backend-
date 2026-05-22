import mongoose from 'mongoose';
import { TErrorSources, TGenericErrorResponse } from '../interface/errorType';

const handleMongooseValidationError = (
  err: mongoose.Error.ValidationError,
): TGenericErrorResponse => {
  const errrorSources: TErrorSources = Object.values(err.errors).map(
    (val: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: val?.path,
        message: val?.message,
      };
    },
  );

  const statusCode = 400;
  return {
    statusCode,
    message: 'Validation error',
    errrorSources,
  };
};

export default handleMongooseValidationError;
