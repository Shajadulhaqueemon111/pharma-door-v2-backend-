import { Request, Response } from 'express';
import productModel from './student.modle';

export const createProduct = async (req: Request, res: Response) => {
  try {
    const productData = req.body;

    const result = await productModel.create(productData);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
