import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DiagnosticoService } from '../../services/diagnostico.service';
import { 
    Sintoma, 
    PreguntaTriaje, 
    RegistroSintomas, 
    DiagnosticoPreliminar 
} from '../../models/sintomas.model';

@Component({
    selector: 'app-registro',
    templateUrl: './registro.component.html',
    styleUrls: ['./registro.component.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule]
})
export class RegistroComponent implements OnInit {
    sintomas: Sintoma[] = [];
    sintomasSeleccionados: Set<string> = new Set();
    preguntasTriaje: { [key: string]: PreguntaTriaje[] } = {};
    respuestasTriaje: { [key: string]: any } = {};
    diagnostico: DiagnosticoPreliminar | null = null;
    paso: 'sintomas' | 'triaje' | 'diagnostico' = 'sintomas';
    cargando = false;
    protected Array = Array; // Para usar Array.from en el template

    constructor(
        private diagnosticoService: DiagnosticoService,
        private router: Router
    ) {}

    ngOnInit() {
        this.sintomas = this.diagnosticoService.getSintomas();
    }

    // Helper methods para manejar valores undefined de forma segura
    getPreguntasLength(sintomaId: string): number {
        return this.preguntasTriaje[sintomaId]?.length || 0;
    }

    getPreguntasTriaje(sintomaId: string): PreguntaTriaje[] {
        return this.preguntasTriaje[sintomaId] || [];
    }

    getRespuestaTriaje(sintomaId: string, preguntaId: string): any {
        return this.respuestasTriaje[sintomaId]?.[preguntaId];
    }

    // Helper method para obtener el nombre del síntoma
    getNombreSintoma(sintomaId: string): string {
        const sintoma = this.sintomas.find(s => s.id === sintomaId);
        return sintoma ? sintoma.nombre : '';
    }

    toggleSintoma(sintomaId: string) {
        if (this.sintomasSeleccionados.has(sintomaId)) {
            this.sintomasSeleccionados.delete(sintomaId);
            delete this.preguntasTriaje[sintomaId];
            delete this.respuestasTriaje[sintomaId];
        } else {
            this.sintomasSeleccionados.add(sintomaId);
            const sintoma = this.sintomas.find(s => s.id === sintomaId);
            if (sintoma?.requierePreguntasAdicionales) {
                this.preguntasTriaje[sintomaId] = this.diagnosticoService.getPreguntasTriaje(sintomaId);
                this.respuestasTriaje[sintomaId] = {};
            }
        }
    }

    continuarATriaje() {
        if (this.sintomasSeleccionados.size === 0) {
            alert('Por favor seleccione al menos un síntoma');
            return;
        }

        const tienePreguntas = Array.from(this.sintomasSeleccionados).some(id => 
            this.getPreguntasLength(id) > 0
        );

        if (tienePreguntas) {
            this.paso = 'triaje';
        } else {
            this.procesarDiagnostico();
        }
    }

    responderTriaje(sintomaId: string, preguntaId: string, respuesta: any) {
        if (!this.respuestasTriaje[sintomaId]) {
            this.respuestasTriaje[sintomaId] = {};
        }
        this.respuestasTriaje[sintomaId][preguntaId] = respuesta;
    }

    procesarDiagnostico() {
        this.cargando = true;
        const registro: RegistroSintomas = {
            id: Date.now().toString(),
            fecha: new Date(),
            pacienteId: 'USER_ID', // Reemplazar con ID real del usuario
            sintomas: Array.from(this.sintomasSeleccionados).map(id => ({
                sintomaId: id,
                valor: true,
                respuestasTriaje: this.respuestasTriaje[id]
            })),
            estado: 'pendiente'
        };

        this.diagnostico = this.diagnosticoService.registrarSintomas(registro);
        this.paso = 'diagnostico';
        this.cargando = false;
    }

    agendarTeleconsulta() {
        if (this.diagnostico?.requiereTeleconsulta) {
            const teleconsulta = this.diagnosticoService.agendarTeleconsulta(
                Date.now().toString(), // ID del registro actual
                'USER_ID' // ID del usuario actual
            );
            this.router.navigate(['/teleconsulta'], { 
                queryParams: { id: teleconsulta.id } 
            });
        }
    }

    verHistorial() {
        this.router.navigate(['/historial']);
    }

    reiniciarRegistro() {
        this.sintomasSeleccionados.clear();
        this.preguntasTriaje = {};
        this.respuestasTriaje = {};
        this.diagnostico = null;
        this.paso = 'sintomas';
    }
} 