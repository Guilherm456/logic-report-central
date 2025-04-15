import { Doctor } from './doctor';

export interface User {
  id: number;

  name: string;

  username: string;
  email: string;

  active: boolean;

  doctor_linked: null | Omit<Doctor, 'user'>;

  createdAt: Date;
  updatedAt: Date;
}

export interface UserDTO {
  username: string;
  email: string;
  password: string;
}
