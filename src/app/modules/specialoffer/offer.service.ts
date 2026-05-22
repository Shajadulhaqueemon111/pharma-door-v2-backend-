import { TofferProduct } from './offer.interface';
import OfferProductModel from './offer.modle';

const createOfferIntoDB = async (paylad: TofferProduct) => {
  const result = await OfferProductModel.create(paylad);
  return result;
};

const getAllOfferIntoDB = async () => {
  const result = await OfferProductModel.find();
  return result;
};

const getSingleOfferIntoDB = async (_id: string) => {
  const result = await OfferProductModel.findById(_id);
  return result;
};

const updateOfferIntoDB = async (
  _id: string,
  payload: Partial<TofferProduct>,
) => {
  const result = await OfferProductModel.findByIdAndUpdate(_id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteOfferIntoDB = async (_id: string) => {
  const result = await OfferProductModel.findByIdAndDelete(_id);
  return result;
};
export const OfferService = {
  createOfferIntoDB,
  getAllOfferIntoDB,
  getSingleOfferIntoDB,
  updateOfferIntoDB,
  deleteOfferIntoDB,
};
