import { Doctor } from './doctor';

export type Template = {
  id: number;
  active: boolean;

  description: string;
  content: string;

  doctor: Doctor;

  createdAt: string;
  updatedAt: string;
};

export type TemplateDTO = {
  description: string;
  content: string;
  doctor_id: number;
};
