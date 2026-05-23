import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import multer from 'multer';
import streamifier from 'streamifier';
import httpStatus from 'http-status';

import AppError from '../../error/app.error';
import config from '../../config';

// cloudinary config
cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
});

// upload image from buffer
export const sendImageToCloudinary = async (
  buffer: Buffer,
  imageName: string,
): Promise<UploadApiResponse> => {
  return new Promise<UploadApiResponse>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        public_id: imageName,
        folder: 'pharmadoor',
      },
      (error, result) => {
        if (error || !result) {
          return reject(
            new AppError(
              httpStatus.BAD_REQUEST,
              'Cloudinary image upload failed',
            ),
          );
        }
        resolve(result);
      },
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// multer memory storage
const storage = multer.memoryStorage();

export const upload = multer({ storage });
