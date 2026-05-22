import { Request, Response } from 'express';
import { orderService } from './order.service';
import catchAsync from '../utils/catchAsync';
import httpStatus from 'http-status';
import sendResponse from '../utils/sendResponse';
export const createOrderController = async (req: Request, res: Response) => {
  try {
    const orderData = req.body;
    console.log(orderData);
    const newOrder = await orderService.createOrder(orderData);
    console.log(newOrder);
    res.status(201).json({
      success: true,
      message: 'Order created successfully!',
      data: newOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
      error,
    });
  }
};

export const getAllOredrMedicines = catchAsync(
  async (req: Request, res: Response) => {
    const result = await orderService.getOrederMedicineIntodb();
    console.log(result);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'All  ordered medicines fetched successfully',
      data: result,
    });
  },
);
export const getSingleOredrMedicines = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await orderService.getSingleOrederMedicineIntodb(id);
    console.log(result);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'All Single  ordered medicines fetched successfully',
      data: result,
    });
  },
);

export const updateOrderStatus = catchAsync(async (req, res) => {
  const { _id } = req.params;

  const payload = req.body;

  const result = await orderService.UpdateOrederMedicineIntodb(_id, payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'order status successfully',
    data: result,
  });
});
export const deleteOrder = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await orderService.deleteOrderIntoDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'order status successfully',
    data: result,
  });
});
