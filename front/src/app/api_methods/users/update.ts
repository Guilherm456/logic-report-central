import { User, UserDTO } from '@models';
import { api } from '@utils/api';

type TMethod = {
  data: Omit<UserDTO, 'password'>;
  id: number;
};

export const updateUser = async ({ data, id }: TMethod) => {
  try {
    const response = await api.put<User>(`/users/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
