import { Schema, model } from 'mongoose';
import { IDoctor } from './doctor.interface';

const doctorSchema = new Schema<IDoctor>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    specialty: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    degrees: {
      type: String,
      required: true,
      trim: true,
    },
    bmdcNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    experience: {
      type: String,
      required: true,
      trim: true,
    },
    hospital: {
      type: String,
      required: true,
      trim: true,
    },
    consultationFee: {
      type: Number,
      required: true,
      default: 300,
    },
    rating: {
      type: Number,
      default: 4.9,
    },
    totalConsultations: {
      type: Number,
      default: 0,
    },
    availability: {
      type: String,
      enum: ['Available', 'Busy', 'Offline'],
      default: 'Available',
    },
    image: {
      type: String,
      required: true,
      default:
        'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=400&auto=format&fit=crop',
    },
    about: {
      type: String,
      default: 'Dedicated specialist committed to patient health and digital healthcare in Bangladesh.',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export const DoctorModel = model<IDoctor>('Doctor', doctorSchema);

