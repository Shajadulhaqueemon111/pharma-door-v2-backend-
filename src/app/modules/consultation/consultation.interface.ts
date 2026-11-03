import { Types } from 'mongoose';

export interface IPrescribedMedicine {
  name: string;
  dosage: string; // e.g. "1+0+1"
  duration: string; // e.g. "7 Days"
  instructions: string; // e.g. "After meal"
}

export interface IConsultationPrescription {
  diagnosis: string;
  medicines: IPrescribedMedicine[];
  advice: string;
  followUpDate?: string;
  issuedAt: Date;
  doctorName: string;
  bmdcNumber?: string;
  degrees?: string;
}

export interface IConsultationMessage {
  senderId: string;
  senderName: string;
  senderRole: 'patient' | 'doctor' | 'admin';
  message: string;
  timestamp: Date;
}

export interface IConsultation {
  _id?: Types.ObjectId;
  consultationId: string; // e.g. CONS-8923
  roomId: string; // for WebRTC video & Socket.io room
  patient: {
    userId?: Types.ObjectId;
    name: string;
    email: string;
    phone: string;
    age: number;
    gender: 'Male' | 'Female' | 'Other';
  };
  specialty: string;
  doctor?: Types.ObjectId;
  doctorName?: string;
  doctorDetails?: {
    degrees?: string;
    hospital?: string;
    bmdcNumber?: string;
    image?: string;
  };
  symptoms: string;
  notes?: string;
  consultationType: 'video' | 'audio' | 'chat';
  fee: number;
  paymentStatus: 'paid' | 'pending';
  status: 'pending_assignment' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  scheduledAt: Date;
  prescription?: IConsultationPrescription;
  messages: IConsultationMessage[];
}

