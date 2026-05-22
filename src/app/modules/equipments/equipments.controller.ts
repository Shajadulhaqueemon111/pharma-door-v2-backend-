import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import { EquipmentService } from './equipments.service';
import sendResponse from '../utils/sendResponse';
import httpStatus from 'http-status';
import { sendImageToCloudinary } from '../utils/sendToimgeCloudinary';
const createEquipment = catchAsync(async (req: Request, res: Response) => {
  const result = await EquipmentService.createEquipmentIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'successfully created equipment',
    data: result,
  });
});
const getAllEquipment = catchAsync(async (req: Request, res: Response) => {
  const result = await EquipmentService.getAllEquipmentsIntoDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'successfully created equipment',
    data: result,
  });
});
const getSingleEquipment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await EquipmentService.getSingleEquipmentIntoDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'successfully created equipment',
    data: result,
  });
});
const updateEquipment = catchAsync(async (req: Request, res: Response) => {
  const { _id } = req.params;
  const payload = req.body;

  if (req.file) {
    const cloudinaryResult = await sendImageToCloudinary(
      req.file.path,
      `equipment-${Date.now()}`,
    );

    payload.medicineImage = cloudinaryResult.secure_url;
  }
  const result = await EquipmentService.updateEquipmentIntoDB(_id, payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'successfully created equipment',
    data: result,
  });
});
const deleteEquipment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await EquipmentService.deleteEquipmentIntoDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'successfully created equipment',
    data: result,
  });
});

export const EquipmentController = {
  createEquipment,
  getAllEquipment,
  getSingleEquipment,
  updateEquipment,
  deleteEquipment,
};
