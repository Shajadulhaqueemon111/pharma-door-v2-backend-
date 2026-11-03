import { Types } from 'mongoose';

export interface IDoctor {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  degrees: string;
  bmdcNumber: string;
  experience: string;
  hospital: string;
  consultationFee: number;
  rating?: number;
  totalConsultations?: number;
  availability: 'Available' | 'Busy' | 'Offline';
  image: string;
  about?: string;
  isActive: boolean;
}

