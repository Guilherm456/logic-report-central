import { Council, Pagination, PaginationResponse } from '@models';
import { api } from '@utils/api';

type TMethod = { search?: string } & Pagination;

export const listCouncils = async ({ ...params }: TMethod) => {
  try {
    const res = await api.get<PaginationResponse<Council>>('/council', {
      params,
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};
