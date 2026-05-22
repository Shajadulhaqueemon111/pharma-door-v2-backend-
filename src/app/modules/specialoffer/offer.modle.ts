import { Schema, model } from 'mongoose';
import { TofferProduct } from './offer.interface';

const offerSchema = new Schema<TofferProduct>(
  {
    name: { type: String, required: true },
    brand: { type: String, required: true },
    generic: { type: String, required: true },
    category: { type: String, required: true },
    dosage: { type: String, required: true },
    form: { type: String, required: true },
    price: { type: String, required: true },
    medicineImage: { type: String },
    offerPercent: { type: String, required: true },
    stock_quantity: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

const OfferProductModel = model<TofferProduct>('OfferProduct', offerSchema);

export default OfferProductModel;
