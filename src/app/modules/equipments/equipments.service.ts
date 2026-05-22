import { IEquipments } from './equipments.interface';
import EquipmentModel from './equipments.module';

const createEquipmentIntoDB = async (payload: IEquipments) => {
  const result = await EquipmentModel.create(payload);
  return result;
};

const getAllEquipmentsIntoDB = async () => {
  const result = await EquipmentModel.find();

  return result;
};

const getSingleEquipmentIntoDB = async (_id: string) => {
  const result = await EquipmentModel.findById(_id);
  return result;
};

const updateEquipmentIntoDB = async (
  _id: string,
  payload: Partial<IEquipments>,
) => {
  const result = await EquipmentModel.findByIdAndUpdate(_id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

const deleteEquipmentIntoDB = async (_id: string) => {
  const result = await EquipmentModel.findByIdAndDelete(_id);

  return result;
};
export const EquipmentService = {
  createEquipmentIntoDB,
  getAllEquipmentsIntoDB,
  getSingleEquipmentIntoDB,
  updateEquipmentIntoDB,
  deleteEquipmentIntoDB,
};
