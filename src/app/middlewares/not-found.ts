/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, RequestHandler, Response } from "express";
import httpsStatus from "http-status";
const notFound: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.status(httpsStatus.NOT_FOUND).json({
    success: false,
    message: "API Not Found",
    error: "",
  });
};

export default notFound;
