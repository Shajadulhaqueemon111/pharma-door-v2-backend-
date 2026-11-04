import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import router from './app/router';
import cookieParser from 'cookie-parser';
import globalErrorHandler from './app/middlewares/globalErrorHandeller';
import notFound from './app/middlewares/not-found';
import { checkExpiredMedicines } from './app/modules/Allmedicine/expire.medicinecheck';
import path from 'path';
const app: Application = express();
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use(
  cors({ origin: (origin, callback) => callback(null, true), credentials: true }),
);
app.use(cookieParser());

app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.use(globalErrorHandler);

//check expire medicine
checkExpiredMedicines();
//not error handeller
app.use(notFound);
export default app;
