/* eslint-disable @typescript-eslint/no-unused-vars */
import path, { join } from 'path';
import { readFileSync, existsSync } from 'fs';
import { veriFyPayment } from './payment.utils';
import OrderModel from '../Order/order.modle';

const conformationService = async (transactionId: string, status: string) => {
  const verifyResponse = await veriFyPayment(transactionId);
  console.log(verifyResponse);
  let result;
  let message = '';

  if (verifyResponse && verifyResponse.pay_status === 'Successful') {
    result = await OrderModel.findOneAndUpdate(
      { transactionId },
      { paymentStatus: 'paid' },
    );
    message = 'Successfully Paid!';
  } else {
    message = 'Payment Failed!';
  }

  const filePath = path.join(__dirname, '../Views/conformation.html');

  if (!existsSync(filePath)) {
    throw new Error(`File not found at path: ${filePath}`);
  }

  let template = readFileSync(filePath, 'utf-8');
  console.log(template);

  template = template.replace('{{message}}', message);
  return template;
};
export const paymentService = {
  conformationService,
};
