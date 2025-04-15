import { Pagination, PaginationResponse, Template } from '@models';
import { api } from '@utils/api';

type TMethod = { search?: string } & Pagination;

export const listTemplates = async ({ ...params }: TMethod) => {
  try {
    const res = await api.get<PaginationResponse<Template>>('/templates', {
      params,
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};
