import { model, Schema } from 'mongoose';
import { TProduct } from './student.interface';
// ✅ ensure this path is correct

const productSchema = new Schema<TProduct>({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  dosage: {
    type: String,
    required: true,
  },
  form: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  generic: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

const productModel = model<TProduct>('Product', productSchema);

export default productModel;
