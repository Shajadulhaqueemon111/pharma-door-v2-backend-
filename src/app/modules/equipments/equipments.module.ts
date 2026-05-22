import mongoose, { model, Schema } from 'mongoose';
import { IEquipments } from './equipments.interface';

const equipmentSchema = new Schema<IEquipments>(
  {
    name: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stock_quantity: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    medicineImage: {
      type: String,
      required: true,
    },
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

const EquipmentModel = model<IEquipments>('Equipment', equipmentSchema);
export default EquipmentModel;
