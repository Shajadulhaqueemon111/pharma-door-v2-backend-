import { model, Schema } from 'mongoose';
import { TPhermasists } from './phermasist.interface';

const phermasistsSchema = new Schema<TPhermasists>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    storeName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    postCode: { type: String, required: true },
    nid: { type: String, required: true },
    nidImage: { type: String, required: true },
    profileImage: { type: String },
    drugLicenseImage: { type: String, required: true },
    tradeLicenseImage: { type: String, required: true },
    // status: {
    //   type: String,
    //   enum: ['pending', 'approved', 'rejected'],
    //   default: 'pending',
    // },
  },
  {
    timestamps: true,
  },
);

const PhermasistModle = model<TPhermasists>('phermasist', phermasistsSchema);

export default PhermasistModle;
