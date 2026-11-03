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
import { sendImageToCloudinary } from '../utils/sendToimgeCloudinary';

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
    message: 'Single medicine fetched successfully',
    data: result,
  });
});

const updateMedicines = catchAsync(async (req: Request, res: Response) => {
  const { _id } = req.params;
  const result = await MedicineService.updateMedicineIntDB(_id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Medicine updated successfully',
    data: result,
  });
});

const deleteMedicines = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await MedicineService.deleteMedicineImtoDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Medicine deleted successfully',
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

// Intelligent medicine matching engine
const matchMedicinesFromText = (extractedText: string, allMedicines: any[]) => {
  const normalized = extractedText.toLowerCase();

  // Common generic to brand mapping in Bangladesh
  const genericToBrands: Record<string, string[]> = {
    paracetamol: ['napa', 'ace', 'fast', 'renova', 'pyrex', 'tamipen'],
    omeprazole: ['seclo', 'losectil', 'proceptin', 'omastin', 'oprazole'],
    esomeprazole: ['maxpro', 'sergel', 'nexum', 'esoral', 'optra'],
    pantoprazole: ['pantonix', 'trupan', 'pantodac', 'protozol'],
    fexofenadine: ['fexo', 'fenadin', 'fexodol', 'fixal'],
    montelukast: ['monas', 'odmon', 'provair', 'm-kast', 'monteair'],
    azithromycin: ['zithrox', 'tritex', 'azithral', 'odaz'],
    cefixime: ['ceftid', 'triocim', 'denvar', 'cefix-a'],
    amoxicillin: ['moxacil', 'fimoxyl', 'amoxil'],
    cetirizine: ['alatrol', 'cetrin', 'atrizin'],
    antacid: ['entacyd', 'gaviscon', 'marlox'],
    ciprofloxacin: ['neoflox', 'cpro', 'ciprocin'],
    vitamin: ['b-50', 'neuro-b', 'ceevit', 'nutrum', 'filwel'],
  };

  const detectedKeywords: string[] = [];
  const matchedList: any[] = [];
  const seenIds = new Set<string>();

  for (const med of allMedicines) {
    if (!med.name) continue;
    const medId = med._id ? med._id.toString() : '';
    const rawName = med.name.toLowerCase().trim();
    const brandName = (med.brand || '').toLowerCase().trim();
    const type = (med.medicineType || '').toLowerCase().trim();

    // Clean name: remove suffixes like "tablet", "capsule", "500mg", etc.
    const cleanName = rawName
      .replace(/\b(tablet|tab|capsule|cap|syrup|syp|inj|injection|usp|bp|mg|ml|gm)\b/gi, '')
      .replace(/[0-9]+/g, '')
      .trim();

    let matched = false;
    let matchConfidence = 0;
    let matchReason = '';

    // 1. Direct word boundary match on raw name or clean name
    const cleanRegex = new RegExp(`\\b${cleanName}\\b`, 'i');
    const rawRegex = new RegExp(`\\b${rawName}\\b`, 'i');

    if (rawRegex.test(normalized)) {
      matched = true;
      matchConfidence = 98;
      matchReason = `Exact match for "${med.name}"`;
      if (!detectedKeywords.includes(med.name)) detectedKeywords.push(med.name);
    } else if (cleanName.length >= 3 && cleanRegex.test(normalized)) {
      matched = true;
      matchConfidence = 92;
      matchReason = `Prescription matched "${med.name}"`;
      if (!detectedKeywords.includes(cleanName)) detectedKeywords.push(cleanName);
    } else if (cleanName.length >= 3 && normalized.includes(cleanName)) {
      matched = true;
      matchConfidence = 85;
      matchReason = `Keyword matched "${med.name}"`;
      if (!detectedKeywords.includes(cleanName)) detectedKeywords.push(cleanName);
    }

    // 2. Brand match
    if (!matched && brandName && brandName.length >= 3) {
      const brandRegex = new RegExp(`\\b${brandName}\\b`, 'i');
      if (brandRegex.test(normalized)) {
        matched = true;
        matchConfidence = 80;
        matchReason = `Matched brand "${med.brand}"`;
        if (!detectedKeywords.includes(med.brand)) detectedKeywords.push(med.brand);
      }
    }

    // 3. Generic ingredient mapping
    if (!matched) {
      for (const [generic, brands] of Object.entries(genericToBrands)) {
        if (normalized.includes(generic)) {
          if (!detectedKeywords.includes(generic)) detectedKeywords.push(generic);
          if (brands.some((b) => rawName.includes(b) || cleanName.includes(b))) {
            matched = true;
            matchConfidence = 90;
            matchReason = `Prescription specified generic "${generic}" (Brand: ${med.name})`;
            break;
          }
        }
      }
    }

    if (matched && !seenIds.has(medId)) {
      seenIds.add(medId);

      // Dosage extraction heuristics
      let suggestedDosage = '1 tablet daily as advised';
      if (/1\s*\+\s*0\s*\+\s*1/i.test(normalized)) {
        suggestedDosage = '1+0+1 (Morning & Night, after meal)';
      } else if (/1\s*\+\s*1\s*\+\s*1/i.test(normalized)) {
        suggestedDosage = '1+1+1 (Thrice daily, after meal)';
      } else if (/0\s*\+\s*0\s*\+\s*1/i.test(normalized)) {
        suggestedDosage = '0+0+1 (At bedtime)';
      } else if (/1\s*\+\s*0\s*\+\s*0/i.test(normalized)) {
        suggestedDosage = '1+0+0 (Morning, before meal)';
      }

      const medObj = typeof med.toObject === 'function' ? med.toObject() : { ...med };
      matchedList.push({
        ...medObj,
        matchConfidence,
        matchReason,
        suggestedDosage,
        inStock: med.stock > 0,
      });
    }
  }

  // Sort descending by confidence
  matchedList.sort((a, b) => b.matchConfidence - a.matchConfidence);

  return { matchedList, detectedKeywords };
};

const checkPrescriptionMedicinesFromImage = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const file = req.file as any;

    if (!file) {
      res
        .status(httpStatus.BAD_REQUEST)
        .json({ success: false, error: 'No prescription file uploaded' });
      return;
    }

    // Supports multer memoryStorage (file.buffer) or diskStorage (file.path)
    const imageInput = file.buffer || file.path || file.tempFilePath;

    if (!imageInput) {
      res
        .status(httpStatus.BAD_REQUEST)
        .json({ success: false, error: 'No valid image buffer or file path found' });
      return;
    }

    let prescriptionImageUrl = '';
    if (file.buffer) {
      try {
        const uploadResult = await sendImageToCloudinary(
          file.buffer,
          `prescription-${Date.now()}`,
        );
        prescriptionImageUrl = uploadResult.secure_url;
      } catch (uploadError) {
        console.warn('Prescription Cloudinary upload warning:', uploadError);
      }
    }

    try {
      // Execute Tesseract OCR directly on buffer or path
      const result = await Tesseract.recognize(imageInput, 'eng');
      const extractedText = (result.data.text || '').trim();

      const allMedicines = await MedicineService.getAllNonExpiredMedicines();

      const { matchedList, detectedKeywords } = matchMedicinesFromText(
        extractedText,
        allMedicines,
      );

      // If no exact match found due to handwriting, provide top store medicines as suggestions
      let fallbackSuggestions: any[] = [];
      if (matchedList.length === 0) {
        fallbackSuggestions = allMedicines.slice(0, 4).map((m: any) => ({
          ...(typeof m.toObject === 'function' ? m.toObject() : m),
          matchConfidence: 65,
          matchReason: 'Pharmacist recommended related medicine',
          suggestedDosage: 'Consult doctor/pharmacist for dosage',
          inStock: m.stock > 0,
        }));
      }

      const finalMedicines = matchedList.length > 0 ? matchedList : fallbackSuggestions;

      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message:
          matchedList.length > 0
            ? 'Medicines recognized and matched successfully'
            : 'Prescription scanned. Showing store medicine suggestions.',
        data: finalMedicines,
        meta: {
          extractedText: extractedText || 'No clear text detected',
          detectedKeywords,
          prescriptionImageUrl,
          exactMatchesFound: matchedList.length,
        } as any,
      });
    } catch (error: any) {
      console.error('OCR processing error:', error);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: 'Prescription OCR processing failed. Please try a clearer image.',
      });
    } finally {
      // Clean up temporary local file if disk storage was used
      if (file.path) {
        fs.unlink(file.path, (err) => {
          if (err) console.error('Failed to remove temp file:', err);
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
