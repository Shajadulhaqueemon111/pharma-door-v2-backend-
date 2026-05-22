import { z } from 'zod';

const offerMedicineZodSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Required' }),
    brand: z.string({ required_error: 'Required' }),
    generic: z.string({ required_error: 'Required' }),
    category: z.string({ required_error: 'Required' }),
    dosage: z.string({ required_error: 'Required' }),
    form: z.string({ required_error: 'Required' }),
    price: z.string({ required_error: 'Required' }),
    // medicineImage: z.string({ required_error: 'Required' }),
    offerPercent: z.string({ required_error: 'Required' }),
    stock_quantity: z.string({ required_error: 'Required' }),
  }),
});
const offerMedicineUpdateZodSchema = offerMedicineZodSchema.partial();
export const OfferZodValidationSchema = {
  offerMedicineZodSchema,
  offerMedicineUpdateZodSchema,
};
