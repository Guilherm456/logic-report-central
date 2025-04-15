export interface User {
  id: number;

  name: string;

  username: string;
  email: string;

  active: boolean;

  createdAt: Date;
  updatedAt: Date;
}
