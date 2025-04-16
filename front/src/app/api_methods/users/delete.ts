import { User } from '@models';
import { api } from '@utils/api';

type TMethod = {
  id: number;
};

export const deleteUser = async ({ id }: TMethod) => {
  try {
    const response = await api.delete<User>(`/users/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
