export interface Sintoma {
    id: string;
    nombre: string;
    descripcion?: string;
    gravedad: 'leve' | 'moderado' | 'grave';
    requierePreguntasAdicionales?: boolean;
}

export interface PreguntaTriaje {
    id: string;
    pregunta: string;
    tipo: 'si/no' | 'escala' | 'seleccion';
    opciones?: string[];
    sintomaAsociado: string;
}

export interface RegistroSintomas {
    id: string;
    fecha: Date;
    pacienteId: string;
    sintomas: {
        sintomaId: string;
        valor: any;
        respuestasTriaje?: { [key: string]: any };
    }[];
    diagnosticoPreliminar?: DiagnosticoPreliminar;
    estado: 'pendiente' | 'procesado' | 'atendido';
}

export interface DiagnosticoPreliminar {
    clasificacion: 'critico' | 'requiereConsulta' | 'leve';
    descripcion: string;
    recomendaciones: string[];
    requiereTeleconsulta: boolean;
    requiereSeguimiento: boolean;
    nivelUrgencia: number; // 1-5
}

export interface Teleconsulta {
    id: string;
    registroSintomasId: string;
    fecha: Date;
    estado: 'pendiente' | 'programada' | 'completada' | 'cancelada';
    observacionesMedico?: string;
    recomendaciones?: string[];
}

export interface HistorialClinico {
    id: string;
    pacienteId: string;
    registros: RegistroSintomas[];
    teleconsultas: Teleconsulta[];
} 