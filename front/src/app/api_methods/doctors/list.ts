import { Doctor, Pagination, PaginationResponse } from '@models';
import { api } from '@utils/api';

type TMethod = {
  type?: 'E' | 'S';
  search?: string;
} & Pagination;

export const listDoctors = async ({ ...params }: TMethod) => {
  try {
    const res = await api.get<PaginationResponse<Doctor>>('/doctors', {
      params,
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};
