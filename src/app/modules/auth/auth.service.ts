/* eslint-disable @typescript-eslint/no-explicit-any */
import config from '../../config';
import AppError from '../../error/app.error';
import { TLogin } from './auth.interface';
import { checkPassword, validUserForLogin } from './auth.utils';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { createToken } from './auth.jwtutils';
import User from '../user/user.modle';
import { sendEmailOtp } from '../utils/sendEmail';
import { createAuditLog } from '../audit/audit.service';
import bcrypt from 'bcryptjs';

// Parse client device and browser from User-Agent
const parseUserAgent = (userAgentString = '') => {
  let device = 'Desktop PC';
  let browser = 'Web Browser';
  let os = 'Windows 11';

  if (/mobile/i.test(userAgentString)) device = 'Smartphone';
  else if (/tablet|ipad/i.test(userAgentString)) device = 'Tablet';

  if (/chrome/i.test(userAgentString) && !/edg/i.test(userAgentString)) browser = 'Google Chrome';
  else if (/edg/i.test(userAgentString)) browser = 'Microsoft Edge';
  else if (/firefox/i.test(userAgentString)) browser = 'Mozilla Firefox';
  else if (/safari/i.test(userAgentString) && !/chrome/i.test(userAgentString)) browser = 'Apple Safari';

  if (/windows/i.test(userAgentString)) os = 'Windows';
  else if (/macintosh|mac os x/i.test(userAgentString)) os = 'macOS';
  else if (/android/i.test(userAgentString)) os = 'Android';
  else if (/iphone|ipad/i.test(userAgentString)) os = 'iOS';
  else if (/linux/i.test(userAgentString)) os = 'Linux';

  return { device, browser, os };
};

// Simple User Registration with 6-digit OTP
const registerUser = async (payload: any, req?: any) => {
  const { name, email, password } = payload;
  const existingUser = await User.findOne({ email: email.toLowerCase() });

  if (existingUser) {
    if (existingUser.isEmailVerified) {
      throw new AppError(httpStatus.CONFLICT, 'An account already exists with this email.');
    }
    // If not verified yet, resend new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    existingUser.emailVerificationOtp = otp;
    existingUser.emailVerificationOtpExpires = new Date(Date.now() + 10 * 60 * 1000);
    existingUser.name = name || existingUser.name;
    existingUser.password = password; // will be hashed in pre-save hook
    await existingUser.save();

    await sendEmailOtp({
      to: email,
      otp,
      title: 'PharmaDoor Account Activation Code',
      message: 'Enter this 6-digit verification code to complete your registration.',
    });

    return {
      message: 'Verification code sent to your email address.',
      email,
    };
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const newUser = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    role: 'user',
    status: 'approved',
    isEmailVerified: false,
    emailVerificationOtp: otp,
    emailVerificationOtpExpires: new Date(Date.now() + 10 * 60 * 1000),
  });

  await sendEmailOtp({
    to: email,
    otp,
    title: 'PharmaDoor Account Activation Code',
    message: 'Welcome to PharmaDoor. Enter this 6-digit verification code to complete your registration.',
  });

  await createAuditLog({
    userId: newUser._id,
    userName: name,
    userEmail: email,
    userRole: 'user',
    action: 'USER_REGISTERED',
    target: 'Auth',
    targetId: String(newUser._id),
    details: 'New user registered, awaiting email verification OTP.',
    ipAddress: req ? (req.headers['x-forwarded-for'] as string) || req.ip || '127.0.0.1' : '127.0.0.1',
    userAgent: req ? req.headers['user-agent'] || 'Web Browser' : 'Web Browser',
  });

  return {
    message: 'Registration successful! Verification code sent to your email.',
    email,
  };
};

// Verify Registration OTP
const verifyRegistrationOtp = async (email: string, otp: string, req?: any) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User account not found.');
  }

  if (!user.emailVerificationOtp || user.emailVerificationOtp !== otp) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid 6-digit verification code.');
  }

  if (user.emailVerificationOtpExpires && new Date() > user.emailVerificationOtpExpires) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Verification code has expired. Please request a new code.');
  }

  user.isEmailVerified = true;
  user.emailVerificationOtp = undefined;
  user.emailVerificationOtpExpires = undefined;

  // Add initial session
  const ua = parseUserAgent(req?.headers['user-agent']);
  user.sessions = [
    {
      ip: (req?.headers['x-forwarded-for'] as string) || req?.ip || '127.0.0.1',
      device: ua.device,
      browser: ua.browser,
      os: ua.os,
      location: 'Dhaka, Bangladesh',
      lastActive: new Date(),
      current: true,
    },
  ];

  await user.save();

  const jwtPayload = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    profileImage: user.profileImage,
    status: user.status || 'approved',
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

  await createAuditLog({
    userId: user._id,
    userName: user.name,
    userEmail: user.email,
    userRole: user.role,
    action: 'EMAIL_VERIFIED',
    target: 'Auth',
    targetId: String(user._id),
    details: 'User successfully verified email address with OTP.',
    ipAddress: (req?.headers['x-forwarded-for'] as string) || req?.ip || '127.0.0.1',
    userAgent: req?.headers['user-agent'] || 'Web Browser',
  });

  return {
    accessToken,
    refressToken,
    user: jwtPayload,
  };
};

// Resend OTP
const resendOtp = async (email: string) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  if (user.twoFactorEnabled) {
    user.twoFactorOtp = otp;
    user.twoFactorOtpExpires = new Date(Date.now() + 10 * 60 * 1000);
  } else {
    user.emailVerificationOtp = otp;
    user.emailVerificationOtpExpires = new Date(Date.now() + 10 * 60 * 1000);
  }
  await user.save();

  await sendEmailOtp({
    to: user.email,
    otp,
    title: 'Your PharmaDoor Verification Code',
    message: 'Here is your requested 6-digit verification code.',
  });

  return { message: 'A new 6-digit code has been sent to your email.' };
};

// Login with 2FA check and 10-minute penalty logic
const LoginUser = async (payload: TLogin, req?: any) => {
  const { password, email } = payload;
  if (!email || !password) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Email and password are required.');
  }

  const user = await validUserForLogin(email);

  // Check 10-minute penalty lockout
  if (user.penaltyUntil && new Date() < new Date(user.penaltyUntil)) {
    const diffMs = new Date(user.penaltyUntil).getTime() - Date.now();
    const remainingMins = Math.ceil(diffMs / 60000);
    throw new AppError(
      httpStatus.FORBIDDEN,
      `Security Lockout: Too many failed 2FA attempts. Please wait ${remainingMins} minute(s) before trying again.`,
    );
  }

  const isPasswordMatched = await checkPassword(password, user.password);
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid email or password.');
  }

  // Check if email is verified
  if (user.role === 'user' && user.isEmailVerified === false) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.emailVerificationOtp = otp;
    user.emailVerificationOtpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendEmailOtp({
      to: user.email,
      otp,
      title: 'Email Verification Required',
      message: 'Please verify your email address to log in.',
    });

    return {
      requiresEmailVerification: true,
      email: user.email,
      message: 'Email verification required. Code sent to your inbox.',
    };
  }

  // Check if 2FA is active (for pharmacist / admin / user)
  if (user.twoFactorEnabled) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.twoFactorOtp = otp;
    user.twoFactorOtpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendEmailOtp({
      to: user.email,
      otp,
      title: 'Two-Factor Authentication (2FA) Code',
      message: 'A login attempt was initiated for your account. Enter this 6-digit OTP code to authorize login.',
    });

    return {
      requires2FA: true,
      email: user.email,
      message: '2FA security verification code sent to your registered email.',
    };
  }

  // Regular login success: reset attempts & penalty
  user.twoFactorAttempts = 0;
  user.penaltyUntil = undefined;

  // Add session
  const ua = parseUserAgent(req?.headers['user-agent']);
  const ip = (req?.headers['x-forwarded-for'] as string) || req?.ip || '127.0.0.1';

  if (!user.sessions) user.sessions = [];
  user.sessions.forEach((s) => (s.current = false));
  user.sessions.unshift({
    ip,
    device: ua.device,
    browser: ua.browser,
    os: ua.os,
    location: 'Dhaka, Bangladesh',
    lastActive: new Date(),
    current: true,
  });
  if (user.sessions.length > 5) user.sessions = user.sessions.slice(0, 5);
  await user.save();

  const jwtPayload = {
    _id: user._id,
    name: user.name,
    email: user?.email,
    role: user?.role,
    profileImage: user.profileImage,
    status: user.status || 'approved',
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

  await createAuditLog({
    userId: user._id,
    userName: user.name,
    userEmail: user.email,
    userRole: user.role,
    action: 'USER_LOGIN',
    target: 'Auth',
    targetId: String(user._id),
    details: `Login successful on ${ua.browser} (${ua.os})`,
    ipAddress: ip,
    userAgent: req?.headers['user-agent'] || 'Web Browser',
  });

  return {
    accessToken,
    refressToken,
    user: jwtPayload,
  };
};

// Verify 2FA with 3-attempt failure => 10 min penalty
const verify2FA = async (email: string, otp: string, req?: any) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User account not found.');
  }

  // Check if penalty lockout active
  if (user.penaltyUntil && new Date() < new Date(user.penaltyUntil)) {
    const diffMs = new Date(user.penaltyUntil).getTime() - Date.now();
    const remainingMins = Math.ceil(diffMs / 60000);
    throw new AppError(
      httpStatus.FORBIDDEN,
      `Security Lockout: Account locked due to repeated incorrect codes. Try again in ${remainingMins} minute(s).`,
    );
  }

  if (user.twoFactorOtp !== otp) {
    user.twoFactorAttempts = (user.twoFactorAttempts || 0) + 1;

    if (user.twoFactorAttempts >= 3) {
      user.penaltyUntil = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes penalty!
      user.twoFactorOtp = undefined;
      await user.save();

      await createAuditLog({
        userId: user._id,
        userName: user.name,
        userEmail: user.email,
        userRole: user.role,
        action: '2FA_LOCKOUT_PENALTY',
        target: 'Security',
        targetId: String(user._id),
        details: 'Failed 3 consecutive 2FA verification attempts. 10-minute lockout penalty applied.',
        ipAddress: (req?.headers['x-forwarded-for'] as string) || req?.ip || '127.0.0.1',
        userAgent: req?.headers['user-agent'] || 'Web Browser',
      });

      throw new AppError(
        httpStatus.FORBIDDEN,
        'Incorrect 2FA code. 3 consecutive failed attempts reached. Account has been locked for 10 minutes for your security.',
      );
    } else {
      await user.save();
      const remaining = 3 - user.twoFactorAttempts;
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Incorrect 2FA verification code. ${remaining} attempt(s) remaining before 10-minute security penalty.`,
      );
    }
  }

  if (user.twoFactorOtpExpires && new Date() > new Date(user.twoFactorOtpExpires)) {
    throw new AppError(httpStatus.BAD_REQUEST, '2FA code has expired. Please request a new code.');
  }

  // Success: reset attempts, clear OTP & penalty
  user.twoFactorAttempts = 0;
  user.twoFactorOtp = undefined;
  user.twoFactorOtpExpires = undefined;
  user.penaltyUntil = undefined;

  const ua = parseUserAgent(req?.headers['user-agent']);
  const ip = (req?.headers['x-forwarded-for'] as string) || req?.ip || '127.0.0.1';

  if (!user.sessions) user.sessions = [];
  user.sessions.forEach((s) => (s.current = false));
  user.sessions.unshift({
    ip,
    device: ua.device,
    browser: ua.browser,
    os: ua.os,
    location: 'Dhaka, Bangladesh',
    lastActive: new Date(),
    current: true,
  });
  if (user.sessions.length > 5) user.sessions = user.sessions.slice(0, 5);
  await user.save();

  const jwtPayload = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    profileImage: user.profileImage,
    status: user.status || 'approved',
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

  await createAuditLog({
    userId: user._id,
    userName: user.name,
    userEmail: user.email,
    userRole: user.role,
    action: '2FA_LOGIN_SUCCESS',
    target: 'Auth',
    targetId: String(user._id),
    details: 'Two-factor authentication verified successfully.',
    ipAddress: ip,
    userAgent: req?.headers['user-agent'] || 'Web Browser',
  });

  return {
    accessToken,
    refressToken,
    user: jwtPayload,
  };
};

// Toggle 2FA Setting
const toggle2FA = async (userId: string, enabled: boolean, req?: any) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found');

  user.twoFactorEnabled = enabled;
  await user.save();

  await createAuditLog({
    userId: user._id,
    userName: user.name,
    userEmail: user.email,
    userRole: user.role,
    action: enabled ? 'ENABLE_2FA' : 'DISABLE_2FA',
    target: 'Security',
    targetId: String(user._id),
    details: `User ${enabled ? 'enabled' : 'disabled'} Two-Factor Authentication.`,
    ipAddress: (req?.headers['x-forwarded-for'] as string) || req?.ip || '127.0.0.1',
    userAgent: req?.headers['user-agent'] || 'Web Browser',
  });

  return { twoFactorEnabled: user.twoFactorEnabled };
};

// Password Change
const changePassword = async (userId: string, payload: any, req?: any) => {
  const { oldPassword, newPassword } = payload;
  if (!oldPassword || !newPassword) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Current and new passwords are required.');
  }

  const user = await User.findById(userId);
  if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found');

  const isMatched = await bcrypt.compare(oldPassword, user.password);
  if (!isMatched) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Current password does not match.');
  }

  user.password = newPassword; // hashed by userSchema pre-save hook
  await user.save();

  await createAuditLog({
    userId: user._id,
    userName: user.name,
    userEmail: user.email,
    userRole: user.role,
    action: 'CHANGE_PASSWORD',
    target: 'Security',
    targetId: String(user._id),
    details: 'User successfully changed account security password.',
    ipAddress: (req?.headers['x-forwarded-for'] as string) || req?.ip || '127.0.0.1',
    userAgent: req?.headers['user-agent'] || 'Web Browser',
  });

  return { message: 'Password changed successfully.' };
};

// Refresh Token
const refreshToken = async (token: string) => {
  if (!token) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You Are Not Authorized!');
  }
  const decoded = jwt.verify(
    token,
    config.jwt_refress_secreet as string,
  ) as JwtPayload;

  const { email } = decoded;
  if (!email) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid Token Payload!');
  }

  const user = await validUserForLogin(email);

  const jwtPayload = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    profileImage: user.profileImage,
    status: user.status || 'approved',
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as unknown as number,
  );
  return {
    accessToken,
  };
};

const logoutUser = async (res: any) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  return {
    message: 'Successfully logged out',
  };
};

const getUserSessions = async (userId: string) => {
  const user = await User.findById(userId);
  return user?.sessions || [];
};

export const authService = {
  LoginUser,
  registerUser,
  verifyRegistrationOtp,
  verify2FA,
  toggle2FA,
  changePassword,
  resendOtp,
  refreshToken,
  logoutUser,
  getUserSessions,
};
