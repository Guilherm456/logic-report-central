import { Pagination, PaginationResponse, User } from '@models';
import { api } from '@utils/api';

type FetchUsersParams = {
  search?: string;
  doctor_linked?: boolean;
} & Pagination;

export const listUsers = async ({
  ...params
}: FetchUsersParams): Promise<PaginationResponse<User>> => {
  try {
    const response = await api.get<PaginationResponse<User>>('/users', {
      params,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
