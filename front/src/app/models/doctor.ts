import { Council, State } from './council';
import { User } from './user';

export interface Doctor {
  id: number;
  name: string;
  type: 'E' | 'S';
  council: Council;
  councilNumber: string;
  state: State;
  active: boolean;

  user: Omit<User, 'doctor_linked'>;

  createdAt: string;
  updatedAt: string;
}

export type DoctorDTO = {
  doctor_type: 'E' | 'S';

  name: string;

  council_number: string;

  council_id: number;

  state_id: number;

  user_id: number;
};
