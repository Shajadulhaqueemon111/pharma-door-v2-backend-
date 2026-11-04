import { Request, Response } from 'express';
import config from '../../config';
import catchAsync from '../utils/catchAsync';
import sendResponse from '../utils/sendResponse';
import httpStatus from 'http-status';
import { authService } from './auth.service';

const register = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.registerUser(req.body, req);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: result.message,
    data: result,
  });
});

const verifyRegistrationOtp = catchAsync(async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  const result = await authService.verifyRegistrationOtp(email, otp, req);
  const { accessToken, refressToken, user } = result;

  res.cookie('refreshToken', refressToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict',
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Email verified and account activated!',
    data: {
      accessToken,
      refreshToken: refressToken,
      user,
    },
  });
});

const resendOtp = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  const result = await authService.resendOtp(email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: null,
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.LoginUser(req.body, req);

  if ((result as any).requires2FA || (result as any).requiresEmailVerification) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: (result as any).message,
      data: result,
    });
    return;
  }

  const { accessToken, refressToken, user } = result as any;

  res.cookie('refreshToken', refressToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict',
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged in successfully!',
    data: {
      accessToken,
      refreshToken: refressToken,
      user,
    },
  });
});

const verify2FA = catchAsync(async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  const result = await authService.verify2FA(email, otp, req);
  const { accessToken, refressToken, user } = result;

  res.cookie('refreshToken', refressToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict',
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Two-Factor Authentication verified successfully!',
    data: {
      accessToken,
      refreshToken: refressToken,
      user,
    },
  });
});

const toggle2FA = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const { enabled } = req.body;
  const result = await authService.toggle2FA(userId, Boolean(enabled), req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Two-Factor Authentication ${enabled ? 'enabled' : 'disabled'} successfully`,
    data: result,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const result = await authService.changePassword(userId, req.body, req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: null,
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken || req.body.refreshToken;
  const result = await authService.refreshToken(token);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access token refreshed successfully!',
    data: result,
  });
});

const logout = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.logoutUser(res);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: null,
  });
});

const getSessions = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const sessions = await authService.getUserSessions(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Active sessions retrieved successfully',
    data: sessions,
  });
});

export const authController = {
  register,
  verifyRegistrationOtp,
  resendOtp,
  loginUser,
  verify2FA,
  toggle2FA,
  changePassword,
  refreshToken,
  logout,
  getSessions,
};
