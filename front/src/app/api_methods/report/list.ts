import { Pagination, PaginationResponse, Report } from '@models';
import { api } from '@utils/api';

type TMethod = { search?: string } & Pagination;

export const listReports = async ({ ...params }: TMethod) => {
  try {
    const res = await api.get<PaginationResponse<Report>>('/reports', {
      params,
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};
