import { z } from 'zod';

export const createUserZodSchema = z.object({
  body: z.object({
    password: z
      .string({ required_error: 'Password is required' })
      .max(20, 'Password must be at most 20 characters'),
    pharmacist: z.object({
      name: z.string().min(1, { message: 'Name is required' }),
      email: z.string().email({ message: 'Invalid email format' }),
      phone: z.string().min(6, { message: 'Phone number is too short' }),
      address: z.string().min(1, { message: 'Address is required' }),
      storeName: z.string().min(1, { message: 'Store name is required' }),
      postCode: z.string().min(1, { message: 'Post code is required' }),
      nid: z.string().min(1, { message: 'NID number is required' }),
    }),
  }),
});

const updatedUserZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    profileImage: z.string().optional(),
    email: z.string().email('Invalid email format').optional(),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .optional(),
    role: z.enum(['user', 'admin', 'pharmacist']).optional(),
    status: z.enum(['pending', 'approved', 'rejected']).optional(),
  }),
});

export const userZodValidationScema = {
  createUserZodSchema,
  updatedUserZodSchema,
};
