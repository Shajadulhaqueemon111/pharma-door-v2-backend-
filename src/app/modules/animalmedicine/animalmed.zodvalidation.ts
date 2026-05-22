import { z } from 'zod';

export const CreateanimalMedicineZodSchema = z.object({
  name: z.string({ required_error: 'Name is required' }),
  category: z.string({ required_error: 'Category is required' }),
  price: z.string({ required_error: 'Price is required' }),
  stock: z.string({ required_error: 'Stock is required' }),
});

export const UpdateanimalMedicineZodSchema = z.object({
  name: z.string().optional(),
  category: z.string().optional(),
  price: z.string().optional(),
  stock: z.string().optional(),
  medicineImage: z.string().optional(),
});
