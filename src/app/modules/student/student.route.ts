import express from 'express';
import { createProduct } from './student.controller';

const router = express.Router();

router.post('/create-product', createProduct);

export const ProductRouter = router;
