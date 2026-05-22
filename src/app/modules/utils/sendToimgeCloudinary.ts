/* eslint-disable @typescript-eslint/no-unused-vars */
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import fs from 'fs/promises';
import httpStatus from 'http-status';

import AppError from '../../error/app.error';
import config from '../../config';

export const sendImageToCloudinary = async (
  filePath: string,
  imageName: string,
) => {
  // Configure cloudinary
  cloudinary.config({
    cloud_name: config.cloudinary_cloud_name,
    api_key: config.cloudinary_api_key,
    api_secret: config.cloudinary_api_secret,
  });

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      public_id: imageName,
    });

    if (!result.secure_url) {
      throw new Error('Image upload failed: secure_url not found');
    }

    await fs.unlink(filePath);

    return result;
  } catch (error) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Cloudinary image upload failed',
    );
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${process.cwd()}/uploads/`);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

export const upload = multer({ storage });
