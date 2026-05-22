import { TAdmin } from './admin.interface';
import AdminModle from './admin.modle';

const getAdmin = async () => {
  const result = await AdminModle.find();

  return result;
};
const getSingleAdmin = async (userId: string) => {
  const result = await AdminModle.findById(userId);

  return result;
};
const updateAdmin = async (userId: string, payload: Partial<TAdmin>) => {
  const result = await AdminModle.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

export const AdminServices = {
  getAdmin,
  getSingleAdmin,
  updateAdmin,
};
