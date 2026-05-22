import { Types } from 'mongoose';

export interface IUserSummary {
  _id: Types.ObjectId;
  name: string;
  email: string;
}

export interface IEquipments {
  name: string;
  brand: string;
  category: string;
  price: number;
  stock_quantity: number;
  rating: number;
  color: string;
  medicineImage: string;
  createdBy: IUserSummary;
}
