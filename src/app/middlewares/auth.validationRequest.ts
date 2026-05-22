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
    //if check the token is client side sent token
    const token = req.headers.authorization;
    console.log(token);
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You Are Not Autorized !');
    }
    //check if the verify token
    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload;
    console.log('amar', decoded);
    //access routing baced autorization function mean using ka ka route use korta parbe
    const { role, email } = decoded;
    if (!email || !role) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid Token Payload!');
    }

    const user = await validUserForLogin(email);
    console.log(user);

    if (!user) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'User not found!');
    }

    // await checkPassword(password, user.password);
    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You Are Not Autorized !');
    }
    // decoded undefined
    req.user = decoded as JwtPayload;

    next();
  });
};

export default authValidateRequest;
