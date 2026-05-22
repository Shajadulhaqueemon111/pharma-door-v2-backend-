import { Request, Response } from 'express';
import { paymentService } from './payment.service';

const conformationController = async (req: Request, res: Response) => {
  console.log(req.query);
  const { transactionId, status } = req.query;
  const result = await paymentService.conformationService(
    transactionId as string,
    status as string,
  );
  res.send(result);
};

export const paymentController = {
  conformationController,
};
