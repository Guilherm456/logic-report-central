import { User } from '@models'; // Importa os tipos necessários
import { api } from '@utils/api'; // Importa a instância base do Axios

type TMethod = {
  id: number;
};

export const getUser = async ({ id }: TMethod) => {
  try {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
