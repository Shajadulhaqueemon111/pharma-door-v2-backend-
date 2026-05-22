import mongoose from 'mongoose';
import AppError from '../../error/app.error';
import AdminModle from '../admin/admin.modle';
import { IUser } from './user.interface';
import UserModle from './user.modle';
import httpStatus from 'http-status';
import User from './user.modle';
import { TAdmin } from '../admin/admin.interface';
import { TPhermasists } from '../phermasist/phermasist.interface';
import PhermasistModle from '../phermasist/phermasist.modle';
import { sendImageToCloudinary } from '../utils/sendToimgeCloudinary';
const createUser = async (payload: IUser) => {
  const result = await UserModle.create(payload);
  return result;
};
//get all user
const getAllUser = async () => {
  const result = await UserModle.find();

  return result;
};
//get single user by id
const getSingleUser = async (userId: string) => {
  const result = await UserModle.findById(userId);
  return result;
};
//user deleteing

const deletedUser = async (userId: string) => {
  const result = await UserModle.findByIdAndDelete(userId);
  return result;
};

//user updated

const updatedUser = async (_id: string, payload: Partial<IUser>) => {
  const result = await UserModle.findByIdAndUpdate(_id, payload, {
    new: true,
    runValidators: true,
  });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  return result;
};

const createAdminIntoDB = async (password: string, payload: TAdmin) => {
  const userData: Partial<IUser> = {
    role: 'admin',
    email: payload.email,
    name: payload.name,
  };
  userData.password = password;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const newUser = await User.create([userData], { session });

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }

    payload.user = newUser[0]._id;

    const newAdmin = await AdminModle.create([payload], { session });

    if (!newAdmin.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin');
    }

    await session.commitTransaction();
    session.endSession();

    return newAdmin[0];
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};
const createPhermasistIntoDB = async (
  password: string,
  payload: TPhermasists,
  files: {
    profileImage?: Express.Multer.File[];
    drugLicenseImage?: Express.Multer.File[];
    nidImage?: Express.Multer.File[];
    tradeLicenseImage?: Express.Multer.File[];
  },
) => {
  // Validate presence of each file
  const requiredFiles = [
    'profileImage',
    'drugLicenseImage',
    'nidImage',
    'tradeLicenseImage',
  ] as const;

  for (const key of requiredFiles) {
    if (!files[key] || files[key]!.length === 0 || !files[key]![0].path) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Missing required file: ${key}`,
      );
    }
  }

  // Helper to upload one file to Cloudinary
  const uploadFile = async (file: Express.Multer.File, label: string) => {
    const safeName = payload.name.replace(/\s+/g, '-').toLowerCase();
    const imageName = `${safeName}-${label}-${Date.now()}`;
    return sendImageToCloudinary(file.path, imageName);
  };

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Upload all files in parallel
    const [profileRes, drugLicenseRes, nidRes, tradeLicenseRes] =
      await Promise.all([
        uploadFile(files.profileImage![0], 'profile'),
        uploadFile(files.drugLicenseImage![0], 'drug-license'),
        uploadFile(files.nidImage![0], 'nid'),
        uploadFile(files.tradeLicenseImage![0], 'trade-license'),
      ]);

    // Assign URLs to payload
    payload.profileImage = profileRes.secure_url;
    payload.drugLicenseImage = drugLicenseRes.secure_url;
    payload.nidImage = nidRes.secure_url;
    payload.tradeLicenseImage = tradeLicenseRes.secure_url;

    // Prepare user data to create User document
    const userData = {
      role: 'pharmacist',
      email: payload.email,
      profileImage: profileRes.secure_url,
      name: payload.name,
      status: payload.status,
      password,
    };

    const newUser = await User.create([userData], { session });
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }

    payload.user = newUser[0]._id;

    const newPharmacist = await PhermasistModle.create([payload], { session });
    if (!newPharmacist.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create pharmacist');
    }

    await session.commitTransaction();

    return newPharmacist[0];
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const UserServices = {
  createUser,
  getAllUser,
  getSingleUser,
  deletedUser,
  updatedUser,
  createAdminIntoDB,
  createPhermasistIntoDB,
};
