/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// controllers/medicine.controller.ts
import { Request, Response } from 'express';
import { MedicineService } from './medicine.service';
import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import sendResponse from '../utils/sendResponse';
import * as Tesseract from 'tesseract.js';
import fs from 'fs';
const createMedicine = catchAsync(async (req: Request, res: Response) => {
  const result = await MedicineService.createMedicine(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Medicine created successfully',
    data: result,
  });
});

const getAllMedicines = catchAsync(async (req: Request, res: Response) => {
  const result = await MedicineService.getAllNonExpiredMedicines();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All medicines fetched successfully',
    data: result,
  });
});
const getSingleMedicines = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await MedicineService.getSingleMedicineIntoDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All medicines fetched successfully',
    data: result,
  });
});
const updateMedicines = catchAsync(async (req: Request, res: Response) => {
  const { _id } = req.params;
  const payload = req.body;
  const result = await MedicineService.updateMedicineIntDB(_id, payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'update medicine successfully',
    data: result,
  });
});
const deleteMedicines = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await MedicineService.deleteMedicineImtoDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'delete medicine successfully',
    data: result,
  });
});

const markExpiredMedicineController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await MedicineService.markExpiredMedicines();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Expired medicines updated successfully',
      data: result,
    });
  },
);

const checkPrescriptionMedicinesFromImage = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const file = req.file as any; // multer + cloudinary file

    if (!file) {
      res
        .status(httpStatus.BAD_REQUEST)
        .json({ error: 'No prescription file uploaded' });
      return;
    }

    const localFilePath = file.path || file.tempFilePath;

    if (!localFilePath) {
      res
        .status(httpStatus.BAD_REQUEST)
        .json({ error: 'No local file found for OCR' });
      return;
    }

    try {
      const result = await Tesseract.recognize(localFilePath, 'eng');
      const extractedText = result.data.text.toLowerCase();

      const allMedicines = await MedicineService.getAllNonExpiredMedicines();

      const matchedMedicines = allMedicines.filter((medicine: any) =>
        extractedText.includes(medicine.name.toLowerCase()),
      );

      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Medicines retrieved successfully',
        data: matchedMedicines,
      });
    } catch (error) {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: 'OCR processing failed' });
    } finally {
      if (localFilePath) {
        fs.unlink(localFilePath, (err) => {
          if (err) {
            console.error('Failed to delete local uploaded file:', err);
          } else {
            console.log('Local file deleted:', localFilePath);
          }
        });
      }
    }
  },
);

export const MedicineController = {
  createMedicine,
  getAllMedicines,
  markExpiredMedicineController,
  updateMedicines,
  deleteMedicines,
  checkPrescriptionMedicinesFromImage,
  getSingleMedicines,
};
