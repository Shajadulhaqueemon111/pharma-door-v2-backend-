import { TPhermasists } from './phermasist.interface';
import PhermasistModle from './phermasist.modle';

const getAllPhermasist = async () => {
  const result = await PhermasistModle.find();

  return result;
};

const getSinglePhermasist = async (userId: string) => {
  const result = await PhermasistModle.findById(userId);

  return result;
};

const updatePhermasist = async (
  userId: string,
  payload: Partial<TPhermasists>,
) => {
  const result = await PhermasistModle.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

const deletePhamasist = async (userId: string) => {
  const result = await PhermasistModle.findByIdAndDelete(userId);

  return result;
};
export const PhermasistService = {
  getAllPhermasist,
  getSinglePhermasist,
  updatePhermasist,
  deletePhamasist,
};
