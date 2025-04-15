import { Doctor } from '@models';
import { api } from '@utils/api';

type TMethod = {
  id: number;
};

export const deleteDoctor = async ({ id }: TMethod) => {
  try {
    const res = await api.delete<Doctor>(`/doctors/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};
