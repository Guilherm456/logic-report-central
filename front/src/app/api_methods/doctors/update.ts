import { Doctor, DoctorDTO } from '@models';
import { api } from '@utils/api';

type TMethod = {
  data: DoctorDTO;
  id: number;
};

export const updateDoctor = async ({ data, id }: TMethod) => {
  try {
    const res = await api.put<Doctor>(`/doctors/${id}`, data);
    return res.data;
  } catch (error) {
    throw error;
  }
};
