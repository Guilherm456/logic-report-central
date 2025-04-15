import { Template } from '@models';
import { api } from '@utils/api';

type TMethod = { id: number };

export const deleteTemplate = async ({ id }: TMethod) => {
  try {
    const res = await api.delete<Template>(`/templates/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};
