import { IDoctor } from './doctor.interface';
import { DoctorModel } from './doctor.model';

const createDoctor = async (payload: IDoctor) => {
  const result = await DoctorModel.create(payload);
  return result;
};

const getAllDoctors = async (query: { specialty?: string; availability?: string; search?: string }) => {
  const filter: any = { isActive: true };
  if (query.specialty && query.specialty !== 'All') {
    filter.specialty = new RegExp(query.specialty, 'i');
  }
  if (query.availability) {
    filter.availability = query.availability;
  }
  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: 'i' } },
      { specialty: { $regex: query.search, $options: 'i' } },
      { degrees: { $regex: query.search, $options: 'i' } },
      { bmdcNumber: { $regex: query.search, $options: 'i' } },
    ];
  }

  const doctors = await DoctorModel.find(filter).sort({ createdAt: -1 });
  return doctors;
};

const getDoctorById = async (id: string) => {
  const doctor = await DoctorModel.findById(id);
  return doctor;
};

const updateDoctor = async (id: string, payload: Partial<IDoctor>) => {
  const result = await DoctorModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteDoctor = async (id: string) => {
  const result = await DoctorModel.findByIdAndDelete(id);
  return result;
};

const seedInitialDoctors = async () => {
  const count = await DoctorModel.countDocuments();
  if (count > 0) {
    return await DoctorModel.find();
  }

  const sampleDoctors: Partial<IDoctor>[] = [
    {
      name: 'Dr. Tanvir Ahmed',
      email: 'dr.tanvir@pharmadoor.com',
      phone: '+8801711223344',
      specialty: 'General Physician',
      degrees: 'MBBS (DMC), BCS (Health), CCD (BIRDEM)',
      bmdcNumber: 'BMDC-A-48291',
      experience: '7+ Years Experience',
      hospital: 'Dhaka Medical College Hospital',
      consultationFee: 300,
      rating: 4.9,
      totalConsultations: 420,
      availability: 'Available',
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=400&auto=format&fit=crop',
      about: 'Expert in primary healthcare, fever, infectious diseases, and chronic illness management.',
      isActive: true,
    },
    {
      name: 'Dr. Nusrat Jahan',
      email: 'dr.nusrat@pharmadoor.com',
      phone: '+8801722334455',
      specialty: 'Cardiologist',
      degrees: 'MBBS, FCPS (Cardiology), MD (Cardiology)',
      bmdcNumber: 'BMDC-A-56214',
      experience: '11+ Years Experience',
      hospital: 'National Institute of Cardiovascular Diseases (NICVD)',
      consultationFee: 600,
      rating: 4.95,
      totalConsultations: 580,
      availability: 'Available',
      image: 'https://images.unsplash.com/photo-1594824813572-c2e8a1599ce7?q=80&w=400&auto=format&fit=crop',
      about: 'Specialized in ischemic heart disease, hypertension, arrhythmia, and lifestyle prevention.',
      isActive: true,
    },
    {
      name: 'Dr. Mahbubur Rahman',
      email: 'dr.mahbub@pharmadoor.com',
      phone: '+8801733445566',
      specialty: 'Pediatrician (Child Specialist)',
      degrees: 'MBBS, DCH, FCPS (Pediatrics)',
      bmdcNumber: 'BMDC-A-39102',
      experience: '9+ Years Experience',
      hospital: 'Bangladesh Shishu Hospital & Institute',
      consultationFee: 450,
      rating: 4.88,
      totalConsultations: 340,
      availability: 'Available',
      image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=400&auto=format&fit=crop',
      about: 'Dedicated pediatric care for newborns, child immunization, nutrition, and pediatric infections.',
      isActive: true,
    },
    {
      name: 'Dr. Farhana Islam',
      email: 'dr.farhana@pharmadoor.com',
      phone: '+8801744556677',
      specialty: 'Gynecologist & Obstetrics',
      degrees: 'MBBS, MS (Gynecology & Obstetrics)',
      bmdcNumber: 'BMDC-A-67819',
      experience: '10+ Years Experience',
      hospital: 'Sir Salimullah Medical College Mitford Hospital',
      consultationFee: 500,
      rating: 4.92,
      totalConsultations: 490,
      availability: 'Available',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=400&auto=format&fit=crop',
      about: 'Comprehensive women’s health, high-risk pregnancy guidance, and hormonal health management.',
      isActive: true,
    },
    {
      name: 'Dr. Ashraful Kabir',
      email: 'dr.ashraf@pharmadoor.com',
      phone: '+8801755667788',
      specialty: 'Dermatologist (Skin Care)',
      degrees: 'MBBS, DDV (BSMMU), MCPS (Dermatology)',
      bmdcNumber: 'BMDC-A-51928',
      experience: '8+ Years Experience',
      hospital: 'Bangabandhu Sheikh Mujib Medical University (BSMMU)',
      consultationFee: 450,
      rating: 4.85,
      totalConsultations: 310,
      availability: 'Available',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=400&auto=format&fit=crop',
      about: 'Clinical dermatology, acne treatment, allergy, eczema, and scalp health consultations.',
      isActive: true,
    },
    {
      name: 'Dr. S. M. Rezaul Karim',
      email: 'dr.rezaul@pharmadoor.com',
      phone: '+8801766778899',
      specialty: 'Gastrologist',
      degrees: 'MBBS, MD (Gastroenterology)',
      bmdcNumber: 'BMDC-A-44312',
      experience: '12+ Years Experience',
      hospital: 'BIRDEM General Hospital',
      consultationFee: 500,
      rating: 4.91,
      totalConsultations: 520,
      availability: 'Available',
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=400&auto=format&fit=crop',
      about: 'Specialized in GERD, peptic ulcer, fatty liver disease, irritable bowel syndrome, and digestive care.',
      isActive: true,
    },
  ];

  const result = await DoctorModel.insertMany(sampleDoctors);
  return result;
};

export const DoctorService = {
  createDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
  seedInitialDoctors,
};

