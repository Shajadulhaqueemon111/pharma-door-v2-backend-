import catchAsync from '../utils/catchAsync';
import sendResponse from '../utils/sendResponse';
import { PhermasistService } from './phermasist.service';
import httpStatus from 'http-status';
const getAllPhermasist = catchAsync(async (req, res) => {
  const result = await PhermasistService.getAllPhermasist();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'get all phermasist retrive successfully',
    data: result,
  });
});
const getSinglePhermasist = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await PhermasistService.getSinglePhermasist(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'get single phermasist retrive successfully',
    data: result,
  });
});
const updatePhermasist = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await PhermasistService.updatePhermasist(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'update phermasist retrive successfully',
    data: result,
  });
});
const deletePhermasist = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await PhermasistService.deletePhamasist(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'deleted phermasist retrive successfully',
    data: result,
  });
});

export const PhermasistController = {
  getAllPhermasist,
  getSinglePhermasist,
  updatePhermasist,
  deletePhermasist,
};
