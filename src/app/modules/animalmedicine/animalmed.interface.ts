import { Types } from 'mongoose';

export interface IUserSummary {
  _id: Types.ObjectId;
  name: string;
  email: string;
}

export type IAnimalMedicine = {
  name: string;
  category: string;
  price: string;
  stock: string;
  medicineImage: string;
  createdBy: IUserSummary;
};
