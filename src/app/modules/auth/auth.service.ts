/* eslint-disable @typescript-eslint/no-explicit-any */
import config from '../../config';
import AppError from '../../error/app.error';
import { TLogin } from './auth.interface';

import { checkPassword, validUserForLogin } from './auth.utils';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { createToken } from './auth.jwtutils';
const LoginUser = async (payload: TLogin) => {
  const { password, email } = payload;
  console.log(typeof email);
  if (!email) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User ID cannot be undefined');
  }
  if (!password) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Password cannot be undefined');
  }
  const user = await validUserForLogin(email);
  console.log(user);
  const isPasswordMatched = await checkPassword(password, user.password);
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
  }

  const jwtPayload = {
    _id: user._id,
    name: user.name,
    email: user?.email,
    role: user?.role,
    profileImage: user.profileImage,
    status: user.status || 'pending',
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as unknown as number,
  );

  const refressToken = createToken(
    jwtPayload,
    config.jwt_refress_secreet as string,
    config.jwt_refress_expires_in as unknown as number,
  );

  return {
    accessToken,
    refressToken,
  };
};
const refreshToken = async (token: string) => {
  if (!token) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You Are Not Autorized !');
  }
  //check if the verify token
  const decoded = jwt.verify(
    token,
    config.jwt_refress_secreet as string,
  ) as JwtPayload;

  //access routing baced autorization function mean using ka ka route use korta parbe
  const { role, email } = decoded;
  if (!email || !role) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid Token Payload!');
  }

  const user = await validUserForLogin(email);

  const jwtPayload = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    profileImage: user.profileImage,
    status: user.status || 'pending',
  };

  console.log('JWT Payload for Refresh Token:', jwtPayload);

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as unknown as number,
  );
  return {
    accessToken,
  };
};

//log out functionality
const logoutUser = async (res: any) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // true in production (HTTPS)
    sameSite: 'strict',
  });

  return {
    message: 'Successfully logged out',
  };
};

export const authService = {
  LoginUser,
  refreshToken,
  logoutUser,
};
