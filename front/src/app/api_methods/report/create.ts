import { Report, ReportDTO } from '@models';
import { api } from '@utils/api';

type TMethod = { data: ReportDTO };

export const createReport = async ({ data }: TMethod) => {
  try {
    const res = await api.post<Report>('/reports', data);
    return res.data;
  } catch (error) {
    throw error;
  }
};
