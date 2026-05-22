import { z } from 'zod';

const createAdminValidationSchema = z.object({
  body: z.object({
    password: z.string().max(20),
    admin: z.object({
      name: z.string().min(1, { message: 'Name is required' }),
      email: z.string().email({ message: 'Invalid email format' }),
      phoneNumber: z.string().min(6, { message: 'Phone number is too short' }),
      profileImage: z.string().url().optional(),
      address: z.string().min(1, { message: 'Address is required' }),
    }),
  }),
});
const updateAdminValidationSchema = z.object({
  body: z.object({
    password: z.string().max(20).optional(),
    admin: z.object({
      name: z.string().min(1, { message: 'Name is required' }).optional(),
      email: z.string().email({ message: 'Invalid email format' }).optional(),
      phoneNumber: z
        .string()
        .min(6, { message: 'Phone number is too short' })
        .optional(),
      profileImage: z.string().url().optional(),
      address: z.string().min(1, { message: 'Address is required' }).optional(),
    }),
  }),
});

export const adminZodValidationSchema = {
  createAdminValidationSchema,
  updateAdminValidationSchema,
};
