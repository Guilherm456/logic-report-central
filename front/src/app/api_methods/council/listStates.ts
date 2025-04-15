import { State } from '@/models';
import { api } from '@utils/api';

export const listStates = async () => {
  try {
    const res = await api.get<State[]>('/council/states');
    return res.data;
  } catch (error) {
    throw error;
  }
};
