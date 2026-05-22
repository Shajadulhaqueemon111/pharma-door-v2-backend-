/* eslint-disable @typescript-eslint/no-this-alias */
import { Schema, model } from 'mongoose';
import { IUser } from './user.interface';
import bycript from 'bcryptjs';
import config from '../../config';
const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },

  profileImage: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'pharmacist'],
    default: 'user',
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
});
userSchema.pre('save', async function (next) {
  //   console.log(this, 'pre hook : we will save data');
  const user = this;
  user.password = await bycript.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});
userSchema.post('save', function (doc, next) {
  //   console.log(this, 'post hook : we will save data');
  doc.password = '';
  next();
});
const User = model<IUser>('User', userSchema);

export default User;
