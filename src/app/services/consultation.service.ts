import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Consultation, Diagnosis, Severity, Symptoms } from '../models/consultation.interface';
import { VitalSigns } from '../models/patient.interface';

@Injectable({
  providedIn: 'root'
})
export class ConsultationService {
  private consultations: Consultation[] = [];

  constructor() {}

  createConsultation(
    patientId: string,
    symptoms: Symptoms,
    vitalSigns: VitalSigns
  ): Observable<Consultation> {
    const diagnosis = this.analyzeSymptomsAndVitals(symptoms, vitalSigns);
    
    const consultation: Consultation = {
      id: Date.now().toString(),
      patientId,
      date: new Date(),
      symptoms,
      vitalSigns,
      diagnosis,
      status: diagnosis.requiresEmergency ? 'pending' : 'completed'
    };

    this.consultations.push(consultation);
    return of(consultation);
  }

  private analyzeSymptomsAndVitals(symptoms: Symptoms, vitals: VitalSigns): Diagnosis {
    let severity: Severity = 'low';
    let requiresConsultation = false;
    let requiresEmergency = false;

    // Basic logic for diagnosis - this would be replaced with actual AI/ML model
    if (vitals.temperature >= 39) {
      severity = 'high';
      requiresConsultation = true;
    } else if (vitals.temperature >= 38) {
      severity = 'medium';
      requiresConsultation = true;
    }

    if (vitals.oxygenSaturation < 90) {
      severity = 'critical';
      requiresEmergency = true;
    }

    // Mock diagnosis based on severity
    const diagnosis: Diagnosis = {
      condition: this.getMockCondition(severity),
      severity,
      recommendations: this.getMockRecommendations(severity),
      requiresConsultation,
      requiresEmergency
    };

    return diagnosis;
  }

  private getMockCondition(severity: Severity): string {
    const conditions = {
      low: 'Resfriado común',
      medium: 'Infección respiratoria',
      high: 'Influenza',
      critical: 'Neumonía severa'
    };
    return conditions[severity];
  }

  private getMockRecommendations(severity: Severity): string[] {
    const recommendations = {
      low: ['Descanso', 'Hidratación', 'Monitorear temperatura'],
      medium: ['Consulta médica virtual', 'Medicamentos antifebriles', 'Reposo absoluto'],
      high: ['Atención médica inmediata', 'Aislamiento', 'Tratamiento específico'],
      critical: ['¡EMERGENCIA! Contactar servicios médicos', 'Oxigenoterapia', 'Hospitalización']
    };
    return recommendations[severity];
  }

  getConsultationHistory(patientId: string): Observable<Consultation[]> {
    return of(this.consultations.filter(c => c.patientId === patientId));
  }

  getConsultation(id: string): Observable<Consultation | undefined> {
    return of(this.consultations.find(c => c.id === id));
  }

  updateConsultationStatus(id: string, status: Consultation['status']): Observable<boolean> {
    const consultation = this.consultations.find(c => c.id === id);
    if (consultation) {
      consultation.status = status;
      return of(true);
    }
    return of(false);
  }
} 