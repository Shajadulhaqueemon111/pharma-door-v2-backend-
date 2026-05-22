import { Request, Response } from 'express';
import { UserServices } from './user.service';
import httpStatus from 'http-status';

import sendResponse from '../utils/sendResponse';
import catchAsync from '../utils/catchAsync';

import AppError from '../../error/app.error';

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

  // Validate required files exist
  if (
    !files['profileImage']?.length ||
    !files['drugLicenseImage']?.length ||
    !files['nidImage']?.length ||
    !files['tradeLicenseImage']?.length
  ) {
    throw new AppError(400, 'All required files must be uploaded');
  }

  // Pass files directly, no wrapping into single files
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

export const UserController = {
  createUsers,
  getAllUser,
  getSingleUser,
  deletedUser,
  updatedUser,
  createAdmin,
  createPhermasist,
};
