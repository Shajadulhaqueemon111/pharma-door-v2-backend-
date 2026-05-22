import { z } from 'zod';

const createPharmacistValidationSchema = z.object({
  body: z.object({
    password: z.string().max(20),
    pharmacist: z.object({
      name: z.string().min(1, { message: 'Name is required' }),
      email: z.string().email({ message: 'Invalid email format' }),
      phone: z.string().min(6, { message: 'Phone number is too short' }),
      address: z.string().min(1, { message: 'Address is required' }),
      storeName: z.string().min(1, { message: 'Store name is required' }),
      postCode: z.string().min(1, { message: 'Post code is required' }),
      nid: z.string().min(1, { message: 'NID number is required' }),
      // nidImage: z.string().url({ message: 'NID image must be a valid URL' }),
      // profileImage: z
      //   .string()
      //   .url({ message: 'Profile image must be a valid URL' }),
      // drugLicenseImage: z
      //   .string()
      //   .url({ message: 'Drug license must be a valid URL' }),
      // tradeLicenseImage: z
      //   .string()
      //   .url({ message: 'Trade license must be a valid URL' }),
    }),
  }),
});

const updatePharmacistValidationSchema = z.object({
  body: z.object({
    password: z.string().max(20).optional(),
    pharmacist: z.object({
      name: z.string().min(1).optional(),
      email: z.string().email().optional(),
      phone: z.string().min(6).optional(),
      address: z.string().min(1).optional(),
      storeName: z.string().min(1).optional(),
      postCode: z.string().min(1).optional(),
      nid: z.string().min(1).optional(),
      nidImage: z.string().url().optional(),
      profileImage: z.string().url().optional(),
      drugLicenseImage: z.string().url().optional(),
      tradeLicenseImage: z.string().url().optional(),
    }),
  }),
});

export const pharmacistZodValidationSchema = {
  createPharmacistValidationSchema,
  updatePharmacistValidationSchema,
};
