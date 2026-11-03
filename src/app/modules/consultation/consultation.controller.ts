import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import sendResponse from '../utils/sendResponse';
import { ConsultationService } from './consultation.service';

const bookConsultation = catchAsync(async (req: Request, res: Response) => {
  const result = await ConsultationService.bookConsultation(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Consultation booked successfully',
    data: result,
  });
});

const getAllConsultations = catchAsync(async (req: Request, res: Response) => {
  const { status, specialty, doctorId } = req.query;
  const result = await ConsultationService.getAllConsultations({
    status: status as string,
    specialty: specialty as string,
    doctorId: doctorId as string,
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Consultations retrieved successfully',
    data: result,
  });
});

const getConsultationByRoomId = catchAsync(async (req: Request, res: Response) => {
  const { roomId } = req.params;
  const result = await ConsultationService.getConsultationByRoomId(roomId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Consultation details retrieved successfully',
    data: result,
  });
});

const assignDoctor = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { doctorId } = req.body;
  const result = await ConsultationService.assignDoctor(id, doctorId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Doctor assigned successfully',
    data: result,
  });
});

const updateStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const result = await ConsultationService.updateStatus(id, status);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Consultation status updated',
    data: result,
  });
});

const savePrescription = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ConsultationService.savePrescription(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Prescription saved & issued successfully',
    data: result,
  });
});

export const ConsultationController = {
  bookConsultation,
  getAllConsultations,
  getConsultationByRoomId,
  assignDoctor,
  updateStatus,
  savePrescription,
};

