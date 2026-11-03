import { IConsultation, IConsultationMessage, IConsultationPrescription } from './consultation.interface';
import { ConsultationModel } from './consultation.model';
import { DoctorModel } from '../doctor/doctor.model';

const bookConsultation = async (payload: Partial<IConsultation>) => {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const consultationId = `CONS-${Date.now().toString().slice(-4)}${randomSuffix}`;
  const roomId = `room-${Math.random().toString(36).substring(2, 9)}-${Date.now().toString().slice(-4)}`;

  let doctorDetails: any = undefined;
  let doctorName = '';
  let status: 'pending_assignment' | 'assigned' = 'pending_assignment';

  if (payload.doctor) {
    const doctor = await DoctorModel.findById(payload.doctor);
    if (doctor) {
      doctorName = doctor.name;
      doctorDetails = {
        degrees: doctor.degrees,
        hospital: doctor.hospital,
        bmdcNumber: doctor.bmdcNumber,
        image: doctor.image,
      };
      status = 'assigned';
    }
  }

  const newConsultation = await ConsultationModel.create({
    ...payload,
    consultationId,
    roomId,
    doctorName,
    doctorDetails,
    status,
    messages: [],
  });

  return newConsultation;
};

const getAllConsultations = async (query: { status?: string; specialty?: string; doctorId?: string }) => {
  const filter: any = {};
  if (query.status && query.status !== 'All') {
    filter.status = query.status;
  }
  if (query.specialty && query.specialty !== 'All') {
    filter.specialty = new RegExp(query.specialty, 'i');
  }
  if (query.doctorId) {
    filter.doctor = query.doctorId;
  }

  const result = await ConsultationModel.find(filter)
    .populate('doctor')
    .sort({ createdAt: -1 });

  return result;
};

const getConsultationByRoomId = async (roomIdOrId: string) => {
  let consultation = await ConsultationModel.findOne({ roomId: roomIdOrId }).populate('doctor');
  if (!consultation) {
    consultation = await ConsultationModel.findById(roomIdOrId).populate('doctor');
  }
  if (!consultation) {
    consultation = await ConsultationModel.findOne({ consultationId: roomIdOrId }).populate('doctor');
  }
  return consultation;
};

const assignDoctor = async (consultationId: string, doctorId: string) => {
  const doctor = await DoctorModel.findById(doctorId);
  if (!doctor) {
    throw new Error('Doctor not found');
  }

  const updatedConsultation = await ConsultationModel.findByIdAndUpdate(
    consultationId,
    {
      doctor: doctor._id,
      doctorName: doctor.name,
      doctorDetails: {
        degrees: doctor.degrees,
        hospital: doctor.hospital,
        bmdcNumber: doctor.bmdcNumber,
        image: doctor.image,
      },
      status: 'assigned',
    },
    { new: true },
  ).populate('doctor');

  return updatedConsultation;
};

const updateStatus = async (
  consultationId: string,
  status: 'pending_assignment' | 'assigned' | 'in_progress' | 'completed' | 'cancelled',
) => {
  const result = await ConsultationModel.findByIdAndUpdate(
    consultationId,
    { status },
    { new: true },
  );
  return result;
};

const savePrescription = async (
  consultationIdOrRoomId: string,
  prescriptionData: IConsultationPrescription,
) => {
  let consultation = await ConsultationModel.findOne({
    $or: [{ _id: consultationIdOrRoomId }, { roomId: consultationIdOrRoomId }, { consultationId: consultationIdOrRoomId }],
  });

  if (!consultation) {
    throw new Error('Consultation not found');
  }

  consultation.prescription = prescriptionData;
  consultation.status = 'completed';
  await consultation.save();

  return consultation;
};

const addMessage = async (
  roomId: string,
  messageData: IConsultationMessage,
) => {
  const consultation = await ConsultationModel.findOneAndUpdate(
    { roomId },
    { $push: { messages: messageData } },
    { new: true },
  );
  return consultation;
};

export const ConsultationService = {
  bookConsultation,
  getAllConsultations,
  getConsultationByRoomId,
  assignDoctor,
  updateStatus,
  savePrescription,
  addMessage,
};

