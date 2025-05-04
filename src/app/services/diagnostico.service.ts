import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { 
    Sintoma, 
    PreguntaTriaje, 
    RegistroSintomas, 
    DiagnosticoPreliminar,
    Teleconsulta,
    HistorialClinico 
} from '../models/sintomas.model';

@Injectable({
    providedIn: 'root'
})
export class DiagnosticoService {
    private historialSubject = new BehaviorSubject<HistorialClinico[]>([]);
    
    // Simulación de base de datos local
    private sintomasDB: Sintoma[] = [
        { id: 'fiebre', nombre: 'Fiebre', gravedad: 'moderado', requierePreguntasAdicionales: true },
        { id: 'tos', nombre: 'Tos', gravedad: 'moderado', requierePreguntasAdicionales: true },
        { id: 'dificultad_respirar', nombre: 'Dificultad para respirar', gravedad: 'grave', requierePreguntasAdicionales: true },
        { id: 'dolor_cabeza', nombre: 'Dolor de cabeza', gravedad: 'leve', requierePreguntasAdicionales: false },
        // Agregar más síntomas según necesidad
    ];

    private preguntasTriajeDB: PreguntaTriaje[] = [
        {
            id: 'fiebre_intensidad',
            pregunta: '¿Qué temperatura tiene?',
            tipo: 'escala',
            sintomaAsociado: 'fiebre'
        },
        {
            id: 'tos_tipo',
            pregunta: '¿Qué tipo de tos presenta?',
            tipo: 'seleccion',
            opciones: ['Seca', 'Con flema', 'Con sangre'],
            sintomaAsociado: 'tos'
        },
        // Agregar más preguntas según necesidad
    ];

    constructor() {
        this.cargarHistorialLocal();
    }

    private cargarHistorialLocal() {
        const historialGuardado = localStorage.getItem('historialClinico');
        if (historialGuardado) {
            this.historialSubject.next(JSON.parse(historialGuardado));
        }
    }

    private guardarHistorialLocal() {
        localStorage.setItem('historialClinico', JSON.stringify(this.historialSubject.value));
    }

    getSintomas(): Sintoma[] {
        return this.sintomasDB;
    }

    getPreguntasTriaje(sintomaId: string): PreguntaTriaje[] {
        return this.preguntasTriajeDB.filter(p => p.sintomaAsociado === sintomaId);
    }

    procesarSintomas(registro: RegistroSintomas): DiagnosticoPreliminar {
        let nivelUrgencia = 0;
        const sintomasGraves = registro.sintomas.filter(s => 
            this.sintomasDB.find(db => db.id === s.sintomaId)?.gravedad === 'grave'
        );

        const sintomasModerados = registro.sintomas.filter(s => 
            this.sintomasDB.find(db => db.id === s.sintomaId)?.gravedad === 'moderado'
        );

        // Lógica de clasificación
        if (sintomasGraves.length > 0) {
            return this.generarDiagnosticoCritico();
        } else if (sintomasModerados.length >= 2) {
            return this.generarDiagnosticoConsulta();
        } else {
            return this.generarDiagnosticoLeve();
        }
    }

    private generarDiagnosticoCritico(): DiagnosticoPreliminar {
        return {
            clasificacion: 'critico',
            descripcion: 'Sus síntomas indican una condición que requiere atención médica inmediata',
            recomendaciones: [
                'Diríjase inmediatamente al centro de salud más cercano',
                'No espere a que los síntomas empeoren',
                'Mantenga la calma y solicite ayuda para transportarse si es necesario'
            ],
            requiereTeleconsulta: true,
            requiereSeguimiento: true,
            nivelUrgencia: 5
        };
    }

    private generarDiagnosticoConsulta(): DiagnosticoPreliminar {
        return {
            clasificacion: 'requiereConsulta',
            descripcion: 'Sus síntomas sugieren que necesita una evaluación médica',
            recomendaciones: [
                'Agende una teleconsulta para evaluación detallada',
                'Mantenga reposo mientras espera la consulta',
                'Monitoree sus síntomas e informe si empeoran'
            ],
            requiereTeleconsulta: true,
            requiereSeguimiento: true,
            nivelUrgencia: 3
        };
    }

    private generarDiagnosticoLeve(): DiagnosticoPreliminar {
        return {
            clasificacion: 'leve',
            descripcion: 'Sus síntomas son leves y pueden manejarse con cuidados básicos',
            recomendaciones: [
                'Mantenga reposo y buena hidratación',
                'Monitoree sus síntomas por 24-48 horas',
                'Si los síntomas empeoran, registre nuevamente'
            ],
            requiereTeleconsulta: false,
            requiereSeguimiento: false,
            nivelUrgencia: 1
        };
    }

    registrarSintomas(registro: RegistroSintomas) {
        const diagnostico = this.procesarSintomas(registro);
        registro.diagnosticoPreliminar = diagnostico;
        registro.estado = 'procesado';

        const historial = this.historialSubject.value;
        const pacienteHistorial = historial.find(h => h.pacienteId === registro.pacienteId);

        if (pacienteHistorial) {
            pacienteHistorial.registros.push(registro);
        } else {
            historial.push({
                id: Date.now().toString(),
                pacienteId: registro.pacienteId,
                registros: [registro],
                teleconsultas: []
            });
        }

        this.historialSubject.next(historial);
        this.guardarHistorialLocal();
        return diagnostico;
    }

    getHistorialPaciente(pacienteId: string): Observable<HistorialClinico[]> {
        return this.historialSubject.asObservable();
    }

    agendarTeleconsulta(registroId: string, pacienteId: string): Teleconsulta {
        const teleconsulta: Teleconsulta = {
            id: Date.now().toString(),
            registroSintomasId: registroId,
            fecha: new Date(),
            estado: 'pendiente'
        };

        const historial = this.historialSubject.value;
        const pacienteHistorial = historial.find(h => h.pacienteId === pacienteId);

        if (pacienteHistorial) {
            pacienteHistorial.teleconsultas.push(teleconsulta);
            this.historialSubject.next(historial);
            this.guardarHistorialLocal();
        }

        return teleconsulta;
    }
} 