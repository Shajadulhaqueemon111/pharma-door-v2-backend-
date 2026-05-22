import { ZodError, ZodIssue } from 'zod';
import { TErrorSources, TGenericErrorResponse } from '../interface/errorType';
//zodError Handeller
const handlerZodError = (err: ZodError): TGenericErrorResponse => {
  const errrorSources: TErrorSources = err.issues.map((issue: ZodIssue) => {
    return {
      path: issue?.path[issue.path.length - 1],
      message: issue.message,
    };
  });
  const statusCode = 400;
  return {
    statusCode,
    message: 'Validation error',
    errrorSources,
  };
};

export default handlerZodError;
