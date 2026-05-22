import { Types } from 'mongoose';
export interface IUserSummary {
  _id: Types.ObjectId;
  name: string;
  email: string;
}

export interface IMedicine {
  _id?: Types.ObjectId;
  name: string;
  brand: string;
  price: number;
  stock: number;
  medicineType: string;
  medicineImage: string;
  manufactureDate: Date;
  expiryDate: Date;
  createdBy: IUserSummary;
  isExpired?: boolean;
}
