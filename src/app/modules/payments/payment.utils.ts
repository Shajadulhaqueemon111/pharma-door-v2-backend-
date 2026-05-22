/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

dotenv.config();

export const initiatePayment = async (paymentData: any) => {
  const response = await axios.post(process.env.PAYMENT_URL!, {
    store_id: process.env.STORE_ID,
    signature_key: process.env.SIGNATURE_KEY,
    tran_id: paymentData.transactionId,

    success_url: `https://pharma-door-backend.vercel.app/api/v1/payment/conformation?transactionId=${paymentData.transactionId}&status=success`,
    fail_url: `https://pharma-door-backend.vercel.app/api/v1/payment/conformation?status=faield`,
    cancel_url: 'https://pharma-door-frontend.vercel.app/payment/cancel',
    amount: paymentData.totalPrice,
    currency: 'BDT',

    desc: 'Merchant Registration Payment',
    cus_name: paymentData.customerName,
    cus_email: paymentData.customerEmail,
    cus_add1: 'House B-158 Road 22',
    cus_add2: 'Mohakhali DOHS',
    cus_city: 'Dhaka',
    cus_state: 'Dhaka',
    cus_postcode: '1002',
    cus_country: 'Bangladesh',
    cus_phone: paymentData.customerPhone,
    type: 'json',
  });

  return response.data;
};

export const veriFyPayment = async (tnxId: string) => {
  try {
    const response = await axios.get(process.env.PAYMENT_VERIFY_URL!, {
      params: {
        store_id: process.env.STORE_ID,
        signature_key: process.env.SIGNATURE_KEY,
        type: 'json',
        request_id: tnxId,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error in verifyPayment:', error);
    return null;
  }
};
