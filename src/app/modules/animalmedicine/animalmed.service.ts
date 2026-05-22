import { IAnimalMedicine } from './animalmed.interface';
import AnimalMedicineModel from './animalmed.modle'; // spelling corrected

const createAnimalmedicine = async (payload: IAnimalMedicine) => {
  const result = await AnimalMedicineModel.create(payload);
  return result;
};

const getAllMedicineIntoDB = async () => {
  const result = await AnimalMedicineModel.find({});
  return result;
};

const getSingleMedicine = async (_id: string) => {
  const result = await AnimalMedicineModel.findById(_id);
  return result;
};

const updateMedicine = async (
  _id: string,
  payload: Partial<IAnimalMedicine>,
) => {
  const result = await AnimalMedicineModel.findByIdAndUpdate(_id, payload, {
    new: true,
  });
  return result;
};

const deleteMedicine = async (_id: string) => {
  const result = await AnimalMedicineModel.findByIdAndDelete(_id);
  return result;
};

export const AnimalMedcineService = {
  createAnimalmedicine,
  getAllMedicineIntoDB,
  getSingleMedicine,
  updateMedicine,
  deleteMedicine,
};
