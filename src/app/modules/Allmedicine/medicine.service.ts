import { IMedicine } from './medicine.interface';
import MedicineModle from './medicine.modle';

const createMedicine = async (payload: IMedicine) => {
  const { expiryDate, createdBy } = payload;
  const today = new Date();

  if (new Date(expiryDate) <= today) {
    throw new Error('Expiry date must be in the future.');
  }

  const medicineToCreate = {
    ...payload,
    createdBy,
  };

  const result = await MedicineModle.create(medicineToCreate);

  return result;
};

const getAllNonExpiredMedicines = async () => {
  const medicines = await MedicineModle.find();
  return medicines;
};

const getSingleMedicineIntoDB = async (_id: string) => {
  const result = await MedicineModle.findById(_id);

  return result;
};
const updateMedicineIntDB = async (
  _id: string,
  payload: Partial<IMedicine>,
) => {
  const result = await MedicineModle.findByIdAndUpdate(_id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteMedicineImtoDB = async (_id: string) => {
  const result = await MedicineModle.findByIdAndDelete(_id);
  return result;
};
const markExpiredMedicines = async () => {
  const today = new Date();

  const expiredMeds = await MedicineModle.find({
    expiryDate: { $lte: today },
    isExpired: false,
  });

  for (const med of expiredMeds) {
    med.isExpired = true;
    await med.save();
  }

  return expiredMeds;
};
export const MedicineService = {
  createMedicine,
  getAllNonExpiredMedicines,
  markExpiredMedicines,
  updateMedicineIntDB,
  deleteMedicineImtoDB,
  getSingleMedicineIntoDB,
};
