import { Doctor } from './doctor';

export type Report = {
  id: number;
  active: boolean;

  patientName: string;
  patientGender: 'M' | 'F' | 'O';
  patientBirthDate: string;

  content: string;

  doctorRequest: Doctor;
  doctor: Doctor;

  createdAt: string;
  updatedAt: string;
};

export type ReportDTO = {
  patient_name: string;
  patient_gender: 'M' | 'F' | 'O';
  patient_birth_date: string;

  doctor_requester_id: number;

  report_content: string;
};
