// medicine.validation.ts
import { z } from 'zod';

export const createMedicineValidationSchema = z.object({
  name: z.string().min(1, 'Medicine name is required'),
  brand: z.string().min(1, 'Brand is required'),
  price: z
    .number({ invalid_type_error: 'Price must be a number' })
    .nonnegative('Price must be non-negative'),
  stock: z
    .number({ invalid_type_error: 'Stock must be a number' })
    .int()
    .nonnegative('Stock must be non-negative'),
  medicineType: z.string().min(1, 'medicine type is required'),
  medicineImage: z.string().url('Valid image URL is required'),
  manufactureDate: z.coerce.date({
    invalid_type_error: 'Invalid manufacture date',
  }),
  expiryDate: z.coerce.date({ invalid_type_error: 'Invalid expiry date' }),

  createdBy: z.object({
    _id: z.string().min(1, '_id is required'),
    name: z.string().min(1, 'Creator name is required'),
    email: z.string().email('Valid email is required'),
  }),

  isExpired: z.boolean().optional(),
});
const updateMedicineValidationSchema = createMedicineValidationSchema.partial();
export const medicineZodValidationSchema = {
  createMedicineValidationSchema,
  updateMedicineValidationSchema,
};
