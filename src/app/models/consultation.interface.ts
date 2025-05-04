import { Patient } from './patient.interface';
import { VitalSigns } from './patient.interface';

export type Severity = 'low' | 'medium' | 'high' | 'critical';

export interface Symptoms {
  description: string[];
  duration: string;
  intensity: number;
}

export interface Diagnosis {
  condition: string;
  severity: Severity;
  recommendations: string[];
  requiresConsultation: boolean;
  requiresEmergency: boolean;
}

export interface Consultation {
  id: string;
  patientId: string;
  doctorId?: string;
  date: Date;
  symptoms: Symptoms;
  vitalSigns: VitalSigns;
  diagnosis: Diagnosis;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  notes?: string;
  followUpDate?: Date;
  teleconsultationLink?: string;
} 