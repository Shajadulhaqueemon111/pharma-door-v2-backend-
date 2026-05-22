import { TProduct } from './student.interface';
import productModel from './student.modle';

const createProduct = async () => {
  const result = await productModel.create();
  return result;
};

const getAllProduct = async () => {
  const result = await productModel.find();

  return result;
};
const getSingleProduct = async (productId: string) => {
  const result = await productModel.findById(productId);

  return result;
};

const updateProduct = async (productId: string, Payload: Partial<TProduct>) => {
  const result = await productModel.findByIdAndUpdate(productId, Payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deletedProduct = async (productId: string) => {
  const result = await productModel.findByIdAndDelete(productId);
  return result;
};

export const productService = {
  createProduct,
  getAllProduct,
  getSingleProduct,
  updateProduct,
  deletedProduct,
};
