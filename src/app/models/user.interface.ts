export interface User {
  id: string;
  email: string;
  password?: string;
  role: 'patient' | 'doctor' | 'admin';
  name: string;
  lastName: string;
  createdAt: Date;
  lastLogin?: Date;
} 