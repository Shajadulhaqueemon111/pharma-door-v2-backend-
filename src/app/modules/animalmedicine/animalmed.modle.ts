import mongoose, { model, Schema } from 'mongoose';
import { IAnimalMedicine } from './animalmed.interface';

const AnimalMedicineSchema = new Schema<IAnimalMedicine>(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: String, required: true },
    stock: { type: String, required: true },
    medicineImage: { type: String, required: true },
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
  },

  {
    timestamps: true,
  },
);

const AnimalMedicineModle = model<IAnimalMedicine>(
  'animalmedicine',
  AnimalMedicineSchema,
);

export default AnimalMedicineModle;
