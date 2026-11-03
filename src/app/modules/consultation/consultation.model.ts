import { Schema, model } from 'mongoose';
import { IConsultation } from './consultation.interface';

const prescribedMedicineSchema = new Schema({
  name: { type: String, required: true },
  dosage: { type: String, default: '1+0+1' },
  duration: { type: String, default: '7 Days' },
  instructions: { type: String, default: 'After meal' },
});

const consultationPrescriptionSchema = new Schema({
  diagnosis: { type: String, required: true },
  medicines: [prescribedMedicineSchema],
  advice: { type: String, default: 'Drink plenty of water and take proper rest.' },
  followUpDate: { type: String },
  issuedAt: { type: Date, default: Date.now },
  doctorName: { type: String, required: true },
  bmdcNumber: { type: String },
  degrees: { type: String },
});

const consultationMessageSchema = new Schema({
  senderId: { type: String, required: true },
  senderName: { type: String, required: true },
  senderRole: {
    type: String,
    enum: ['patient', 'doctor', 'admin'],
    required: true,
  },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const consultationSchema = new Schema<IConsultation>(
  {
    consultationId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    roomId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    patient: {
      userId: { type: Schema.Types.ObjectId, ref: 'User' },
      name: { type: String, required: true },
      email: { type: String, default: '' },
      phone: { type: String, required: true },
      age: { type: Number, required: true },
      gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Male' },
    },
    specialty: {
      type: String,
      required: true,
    },
    doctor: {
      type: Schema.Types.ObjectId,
      ref: 'Doctor',
    },
    doctorName: {
      type: String,
      default: '',
    },
    doctorDetails: {
      degrees: { type: String },
      hospital: { type: String },
      bmdcNumber: { type: String },
      image: { type: String },
    },
    symptoms: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      default: '',
    },
    consultationType: {
      type: String,
      enum: ['video', 'audio', 'chat'],
      default: 'video',
    },
    fee: {
      type: Number,
      required: true,
      default: 300,
    },
    paymentStatus: {
      type: String,
      enum: ['paid', 'pending'],
      default: 'paid',
    },
    status: {
      type: String,
      enum: ['pending_assignment', 'assigned', 'in_progress', 'completed', 'cancelled'],
      default: 'pending_assignment',
      index: true,
    },
    scheduledAt: {
      type: Date,
      default: Date.now,
    },
    prescription: consultationPrescriptionSchema,
    messages: [consultationMessageSchema],
  },
  {
    timestamps: true,
  },
);

export const ConsultationModel = model<IConsultation>('Consultation', consultationSchema);

