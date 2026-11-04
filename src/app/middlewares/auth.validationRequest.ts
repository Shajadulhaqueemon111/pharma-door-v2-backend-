import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import catchAsync from '../modules/utils/catchAsync';
import AppError from '../error/app.error';
import { validUserForLogin } from '../modules/auth/auth.utils';
import { TUserRole } from '../modules/user/user.interface';

const authValidateRequest = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // Check client side sent token
    let token = req.headers.authorization;
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You Are Not Authorized !');
    }

    if (token.startsWith('Bearer ')) {
      token = token.slice(7).trim();
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload;

    const { role, email } = decoded;
    if (!email || !role) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid Token Payload!');
    }

    const user = await validUserForLogin(email);
    if (!user) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'User not found!');
    }

    if (requiredRoles && requiredRoles.length > 0 && !requiredRoles.includes(role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You Are Not Authorized !');
    }

    req.user = decoded as JwtPayload;
    next();
  });
};

export default authValidateRequest;
