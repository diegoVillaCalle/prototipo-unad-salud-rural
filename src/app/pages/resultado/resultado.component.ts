import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ConsultationService } from '../../services/consultation.service';
import { Consultation } from '../../models/consultation.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-resultado',
  templateUrl: './resultado.component.html',
  styleUrls: ['./resultado.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class ResultadoComponent implements OnInit {
  consultation: Consultation | undefined;
  loading = true;
  error = '';
  severity: string = 'moderate';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private consultationService: ConsultationService
  ) {}

  ngOnInit(): void {
    const consultationId = this.route.snapshot.queryParams['id'];
    if (!consultationId) {
      this.router.navigate(['/home']);
      return;
    }

    this.consultationService.getConsultation(consultationId)
      .subscribe({
        next: (consultation) => {
          if (consultation) {
            this.consultation = consultation;
          } else {
            this.error = 'No se encontró la consulta';
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al obtener la consulta:', error);
          this.error = 'Error al cargar los resultados';
          this.loading = false;
        }
      });

    this.route.queryParams.subscribe(params => {
      this.severity = params['severity'] || 'moderate';
      this.loading = false;
    });
  }

  getSeverityClass(severity: string): string {
    const classes = {
      low: 'severity-low',
      medium: 'severity-medium',
      high: 'severity-high',
      critical: 'severity-critical'
    };
    return classes[severity as keyof typeof classes] || '';
  }

  startTeleconsultation(): void {
    if (this.consultation) {
      this.router.navigate(['/teleconsulta'], {
        queryParams: { id: this.consultation.id }
      });
    }
  }

  goToEmergency(): void {
    // Aquí se implementaría la lógica para contactar servicios de emergencia
    console.log('Contactando servicios de emergencia...');
  }
} 