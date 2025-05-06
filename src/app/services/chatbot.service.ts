import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, mergeMap } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ChatMessage, ChatSession } from '../models/chat.model';

@Injectable({
    providedIn: 'root'
})
export class ChatbotService {
    private currentSession: ChatSession | null = null;
    private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
    public messages$ = this.messagesSubject.asObservable();

    private readonly INITIAL_MESSAGE: ChatMessage = {
        id: 'welcome',
        text: '¡Hola! Soy tu asistente virtual de salud. ¿Cómo puedo ayudarte hoy?',
        sender: 'bot',
        timestamp: new Date(),
        type: 'option',
        options: [
            'Registrar síntomas',
            'Consultar mi historial',
            'Agendar teleconsulta',
            'Información general'
        ]
    };

    private readonly SYMPTOM_QUESTIONS: ChatMessage[] = [
        {
            id: 'symptom_start',
            text: 'Por favor, describe los síntomas que estás experimentando.',
            sender: 'bot',
            timestamp: new Date(),
            type: 'text'
        },
        {
            id: 'symptom_duration',
            text: '¿Hace cuánto tiempo comenzaron los síntomas?',
            sender: 'bot',
            timestamp: new Date(),
            type: 'option',
            options: [
                'Hoy',
                'Hace algunos días',
                'Hace una semana o más',
                'Hace más de un mes'
            ]
        },
        {
            id: 'symptom_severity',
            text: '¿Cómo calificarías la intensidad de los síntomas?',
            sender: 'bot',
            timestamp: new Date(),
            type: 'option',
            options: [
                'Leve - No interfiere con mis actividades diarias',
                'Moderado - Dificulta algunas actividades',
                'Severo - Me impide realizar actividades normales',
                'Muy severo - Necesito atención inmediata'
            ]
        }
    ];

    constructor() {
        this.initSession();
    }

    private initSession() {
        this.currentSession = {
            id: Date.now().toString(),
            messages: [this.INITIAL_MESSAGE],
            startTime: new Date(),
            symptoms: []
        };
        this.messagesSubject.next(this.currentSession.messages);
    }

    public sendMessage(message: string): Observable<void> {
        if (!this.currentSession) {
            this.initSession();
        }

        // Agregar mensaje del usuario
        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            text: message,
            sender: 'user',
            timestamp: new Date()
        };

        this.addMessage(userMessage);

        // Procesar respuesta
        return this.processUserMessage(message);
    }

    public selectOption(option: string): Observable<void> {
        const message: ChatMessage = {
            id: Date.now().toString(),
            text: option,
            sender: 'user',
            timestamp: new Date(),
            type: 'option',
            selected: true
        };

        this.addMessage(message);
        return this.processUserMessage(option);
    }

    private addMessage(message: ChatMessage) {
        if (this.currentSession) {
            this.currentSession.messages.push(message);
            this.messagesSubject.next(this.currentSession.messages);
        }
    }

    private processUserMessage(message: string): Observable<void> {
        // Simular procesamiento
        return of(null).pipe(
            delay(1000),
            mergeMap(() => new Observable<void>(observer => {
                let response: ChatMessage | null = null;

                // Lógica de respuesta basada en el mensaje
                if (message.toLowerCase().includes('síntoma') || message === 'Registrar síntomas') {
                    response = this.SYMPTOM_QUESTIONS[0];
                } else if (message.toLowerCase().includes('historial')) {
                    response = {
                        id: Date.now().toString(),
                        text: 'Puedes consultar tu historial médico en la sección "Historial" del menú principal.',
                        sender: 'bot',
                        timestamp: new Date()
                    };
                } else if (message.toLowerCase().includes('teleconsulta')) {
                    response = {
                        id: Date.now().toString(),
                        text: '¿Te gustaría agendar una teleconsulta con un profesional de la salud?',
                        sender: 'bot',
                        timestamp: new Date(),
                        type: 'option',
                        options: ['Sí, agendar ahora', 'No, más tarde']
                    };
                } else {
                    response = {
                        id: Date.now().toString(),
                        text: 'Lo siento, no pude entender tu mensaje. ¿Podrías reformularlo o seleccionar una de las opciones disponibles?',
                        sender: 'bot',
                        timestamp: new Date(),
                        type: 'option',
                        options: [
                            'Registrar síntomas',
                            'Consultar mi historial',
                            'Agendar teleconsulta',
                            'Información general'
                        ]
                    };
                }

                if (response) {
                    this.addMessage(response);
                }
                observer.next();
                observer.complete();
            }))
        );
    }

    public endSession() {
        if (this.currentSession) {
            this.currentSession.endTime = new Date();
            // Aquí podrías guardar la sesión en el almacenamiento local o enviarla al servidor
        }
        this.initSession();
    }
} 