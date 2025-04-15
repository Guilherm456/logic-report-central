import { Doctor, DoctorDTO } from '@models';
import { api } from '@utils/api';

type TMethod = {
  data: DoctorDTO;
};

export const createDoctor = async ({ data }: TMethod) => {
  try {
    const res = await api.post<Doctor>('/doctors', data);
    return res.data;
  } catch (error) {
    throw error;
  }
};
