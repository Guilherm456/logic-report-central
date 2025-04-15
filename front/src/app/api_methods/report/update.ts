import { Report, ReportDTO } from '@models';
import { api } from '@utils/api';

type TMethod = { data: ReportDTO; id: number };

export const updateReport = async ({ data, id }: TMethod) => {
  try {
    const res = await api.put<Report>(`/reports/${id}`, data);
    return res.data;
  } catch (error) {
    throw error;
  }
};
