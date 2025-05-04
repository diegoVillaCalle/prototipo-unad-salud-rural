import { User } from './user.interface';

export interface VitalSigns {
  temperature: number;
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  heartRate: number;
  respiratoryRate: number;
  oxygenSaturation: number;
}

export interface Location {
  municipality: string;
  department: string;
  address: string;
}

export interface Patient extends User {
  age: number;
  location: Location;
  medicalHistory: {
    conditions: string[];
    allergies: string[];
    medications: string[];
  };
  vitalSigns?: VitalSigns;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
} 