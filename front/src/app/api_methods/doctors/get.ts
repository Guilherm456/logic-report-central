import { Doctor } from '@models';
import { api } from '@utils/api';

type TMethod = {
  id: number;
};

export const getDoctor = async ({ id }: TMethod) => {
  try {
    const res = await api.get<Doctor>(`/doctors/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};
