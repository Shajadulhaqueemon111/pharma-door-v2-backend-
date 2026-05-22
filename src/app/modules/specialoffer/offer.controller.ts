import AppError from '../../error/app.error';
import catchAsync from '../utils/catchAsync';
import sendResponse from '../utils/sendResponse';
import { sendImageToCloudinary } from '../utils/sendToimgeCloudinary';
import { OfferService } from './offer.service';
import httpStatus from 'http-status';
const createOffer = catchAsync(async (req, res) => {
  const payload = req.body;
  const file = req.file;

  if (!file?.path) {
    throw new AppError(httpStatus.BAD_REQUEST, 'No image provided');
  }

  const cloudinaryResult = await sendImageToCloudinary(
    file.path,
    file.filename,
  );

  payload.medicineImage = cloudinaryResult.secure_url;

  const result = await OfferService.createOfferIntoDB(payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offer medicine created successfully',
    data: result,
  });
});
const getAllOffer = catchAsync(async (req, res) => {
  const result = await OfferService.getAllOfferIntoDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'offer medicine retrive successfully',
    data: result,
  });
});
const getSingleOffer = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await OfferService.getSingleOfferIntoDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'single offer medicine retrive successfully',
    data: result,
  });
});
const updateOffer = catchAsync(async (req, res) => {
  const { _id } = req.params;
  const paylad = req.body;
  const result = await OfferService.updateOfferIntoDB(_id, paylad);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'offer medicine create successfully',
    data: result,
  });
});
const deleteOffer = catchAsync(async (req, res) => {
  const { _id } = req.params;
  const result = await OfferService.deleteOfferIntoDB(_id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'offer medicine deleted successfully',
    data: result,
  });
});

export const OfferController = {
  createOffer,
  getAllOffer,
  getSingleOffer,
  updateOffer,
  deleteOffer,
};
