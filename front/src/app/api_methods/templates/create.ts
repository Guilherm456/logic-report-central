import { Template, TemplateDTO } from '@models';
import { api } from '@utils/api';

type TMethod = { data: TemplateDTO };

export const createTemplate = async ({ data }: TMethod) => {
  try {
    const res = await api.post<Template>('/templates', data);
    return res.data;
  } catch (error) {
    throw error;
  }
};
