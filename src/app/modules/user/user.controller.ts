import { Request, Response } from 'express';
import { UserServices } from './user.service';
import httpStatus from 'http-status';

import sendResponse from '../utils/sendResponse';
import catchAsync from '../utils/catchAsync';
import AppError from '../../error/app.error';
import { sendImageToCloudinary } from '../utils/sendToimgeCloudinary';
import User from './user.modle';
import { createAuditLog } from '../audit/audit.service';

const createUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.createUser(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User created successfully',
    data: result,
  });
});
const getAllUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.getAllUser();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Get all user retrive successfully',
    data: result,
  });
});
const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserServices.getSingleUser(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'get single user retrive successfully',
    data: result,
  });
});
const deletedUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserServices.deletedUser(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User deleted successfully',
    data: result,
  });
});
const updatedUser = catchAsync(async (req: Request, res: Response) => {
  const _id = req.params.id;
  const payload = req.body;
  const result = await UserServices.updatedUser(_id, payload);

  await createAuditLog({
    userId: req.user?._id,
    userName: req.user?.name,
    userEmail: req.user?.email,
    userRole: req.user?.role,
    action: 'UPDATE_USER_PROFILE',
    target: 'User',
    targetId: _id,
    details: `Updated fields: ${Object.keys(payload).join(', ')}`,
    ipAddress: (req.headers['x-forwarded-for'] as string) || req.ip || '127.0.0.1',
    userAgent: req.headers['user-agent'] || 'Web Browser',
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User updated successfully',
    data: result,
  });
});

const createAdmin = catchAsync(async (req, res) => {
  const { password, admin: adminData } = req.body;
  const result = await UserServices.createAdminIntoDB(password, adminData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin Created is successfully',
    data: result,
  });
});

const createPhermasist = catchAsync(async (req, res) => {
  const { password, pharmacist } = req.body;

  if (!password || !pharmacist) {
    throw new AppError(400, 'Password and pharmacist are required');
  }

  const files = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };

  if (
    !files['profileImage']?.length ||
    !files['drugLicenseImage']?.length ||
    !files['nidImage']?.length ||
    !files['tradeLicenseImage']?.length
  ) {
    throw new AppError(400, 'All required files must be uploaded');
  }

  const result = await UserServices.createPhermasistIntoDB(
    password,
    pharmacist,
    files,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Pharmacist created successfully',
    data: result,
  });
});

const uploadAvatar = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Please upload an image file');
  }

  const userId = req.user?._id;
  const imageName = `avatar_${userId}_${Date.now()}`;
  const uploadResult = await sendImageToCloudinary(req.file.buffer, imageName);

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { profileImage: uploadResult.secure_url },
    { new: true },
  );

  await createAuditLog({
    userId,
    userName: req.user?.name,
    userEmail: req.user?.email,
    userRole: req.user?.role,
    action: 'UPLOAD_CLOUDINARY_AVATAR',
    target: 'User',
    targetId: String(userId),
    details: `Uploaded new profile photo hosted on Cloudinary: ${uploadResult.secure_url}`,
    ipAddress: (req.headers['x-forwarded-for'] as string) || req.ip || '127.0.0.1',
    userAgent: req.headers['user-agent'] || 'Web Browser',
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Profile photo uploaded to Cloudinary successfully',
    data: {
      profileImage: uploadResult.secure_url,
      user: updatedUser,
    },
  });
});

export const UserController = {
  createUsers,
  getAllUser,
  getSingleUser,
  deletedUser,
  updatedUser,
  createAdmin,
  createPhermasist,
  uploadAvatar,
};
