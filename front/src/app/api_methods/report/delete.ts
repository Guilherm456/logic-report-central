import { Report } from '@models';
import { api } from '@utils/api';

type TMethod = { id: number };

export const deleteReport = async ({ id }: TMethod) => {
  try {
    const res = await api.delete<Report>(`/reports/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};
