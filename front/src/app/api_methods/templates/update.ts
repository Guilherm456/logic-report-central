import { Template, TemplateDTO } from '@models';
import { api } from '@utils/api';

type TMethod = { data: TemplateDTO; id: number };

export const updateTemplate = async ({ data, id }: TMethod) => {
  try {
    const res = await api.put<Template>(`/templates/${id}`, data);
    return res.data;
  } catch (error) {
    throw error;
  }
};
