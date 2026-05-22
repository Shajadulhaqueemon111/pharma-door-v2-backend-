import catchAsync from '../utils/catchAsync';
import sendResponse from '../utils/sendResponse';
import { AnimalMedcineService } from './animalmed.service';
import httpStatus from 'http-status';

// CREATE
const createAnimalmedicine = catchAsync(async (req, res) => {
  const result = await AnimalMedcineService.createAnimalmedicine(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Animal medicine created successfully',
    data: result,
  });
});

// GET ALL
const getAllMedicineIntoDB = catchAsync(async (req, res) => {
  const result = await AnimalMedcineService.getAllMedicineIntoDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All animal medicines retrieved successfully',
    data: result,
  });
});

// GET SINGLE
const getSingleMedicine = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AnimalMedcineService.getSingleMedicine(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Animal medicine retrieved successfully',
    data: result,
  });
});

const updateMedicine = catchAsync(async (req, res) => {
  const { _id } = req.params;
  const result = await AnimalMedcineService.updateMedicine(_id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Animal medicine updated successfully',
    data: result,
  });
});

const deleteMedicine = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AnimalMedcineService.deleteMedicine(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Animal medicine deleted successfully',
    data: result,
  });
});

export const AnimalMedicineController = {
  createAnimalmedicine,
  getAllMedicineIntoDB,
  getSingleMedicine,
  updateMedicine,
  deleteMedicine,
};
