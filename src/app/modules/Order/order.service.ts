/* eslint-disable @typescript-eslint/no-explicit-any */

import { initiatePayment } from '../payments/payment.utils';
import { modelMapper } from './modle.mapper';
import orderModle from './order.modle';

const createOrder = async (orderData: any) => {
  const { user, products } = orderData;
  console.log('Incoming Order Data:', orderData);

  let totalPrice = 0;

  // Dynamically fetch from proper model
  const productDetails = await Promise.all(
    products.map(async (item: any) => {
      console.log('item data:', item);

      const Model = modelMapper[item.model];

      if (!Model) throw new Error(`Unknown product model: ${item.model}`);

      const product = await Model.findById(item.product);
      console.log('Product found:', product);

      if (product) {
        const productPrice = Number(product.price);
        totalPrice += productPrice * item.quantity;
        return {
          product: product._id,
          quantity: item.quantity,
          pharmacist: item.pharmacist,
        };
      } else {
        throw new Error('Product not found');
      }
    }),
  );

  const transactionId = `TXN-${Date.now()}`;

  const order = new orderModle({
    user,
    products: productDetails,
    totalPrice,
    status: 'Pending',
    paymentStatus: 'Pending',
    transactionId,
  });

  await order.save();

  const paymentData = {
    transactionId,
    totalPrice,
    customerName: user.name,
    customerEmail: user.email,
    customerPhone: user.phone,
    customerAddress: user.address,
  };

  const paymentSession = await initiatePayment(paymentData);
  return paymentSession;
};

const getOrederMedicineIntodb = async () => {
  const result = await orderModle.find();

  return result;
};
const getSingleOrederMedicineIntodb = async (_id: string) => {
  const result = await orderModle.findById(_id);
  return result;
};
const UpdateOrederMedicineIntodb = async (
  _id: string,
  payload: Partial<typeof orderModle>,
) => {
  const result = await orderModle.findByIdAndUpdate(_id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteOrderIntoDB = async (_id: string) => {
  const result = await orderModle.findByIdAndDelete(_id);

  return result;
};
export const orderService = {
  createOrder,
  getOrederMedicineIntodb,
  getSingleOrederMedicineIntodb,
  UpdateOrederMedicineIntodb,
  deleteOrderIntoDB,
};
