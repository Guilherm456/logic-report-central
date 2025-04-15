import { Report } from '@models';
import { api } from '@utils/api';

type TMethod = { id: number };

export const getReport = async ({ id }: TMethod) => {
  try {
    const res = await api.get<Report>(`/reports/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};
