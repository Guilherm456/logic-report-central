import { User, UserDTO } from '@models';
import { api } from '@utils/api';

type TMethod = {
  data: UserDTO;
};

export const createUser = async ({ data }: TMethod) => {
  try {
    const response = await api.post<User>('/users', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
