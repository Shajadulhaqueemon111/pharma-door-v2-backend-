import { Types } from 'mongoose';

export type TPhermasists = {
  // name: string;
  // email: string;
  // phoneNumber: string;
  // profileImage?: string;
  // address: string;
  user: Types.ObjectId;
  name: string;
  address: string;
  storeName: string;
  phone: string;
  email: string;
  postCode: string;
  nid: string;
  profileImage: string;
  nidImage: string;
  drugLicenseImage: string;
  tradeLicenseImage: string;
  status?: 'pending' | 'approved' | 'rejected';
};
