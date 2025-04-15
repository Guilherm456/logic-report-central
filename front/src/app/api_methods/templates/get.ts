import { Template } from '@models';
import { api } from '@utils/api';

type TMethod = { id: number };

export const getTemplate = async ({ id }: TMethod) => {
  try {
    const res = await api.get<Template>(`/templates/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};
