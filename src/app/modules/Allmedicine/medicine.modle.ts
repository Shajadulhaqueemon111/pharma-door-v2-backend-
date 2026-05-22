import mongoose, { model } from 'mongoose';
import { IMedicine } from './medicine.interface';

const medicineSchema = new mongoose.Schema({
  name: String,
  brand: String,
  price: Number,
  stock: Number,
  medicineType: String,
  medicineImage: String,
  manufactureDate: Date,
  expiryDate: Date,

  createdBy: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },

  isExpired: {
    type: Boolean,
    default: false,
  },
});

const MedicineModle = model<IMedicine>('Medicine', medicineSchema);

export default MedicineModle;
