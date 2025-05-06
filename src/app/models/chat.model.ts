export interface ChatMessage {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
    type?: 'text' | 'option' | 'symptom';
    options?: string[];
    selected?: boolean;
}

export interface ChatSession {
    id: string;
    messages: ChatMessage[];
    startTime: Date;
    endTime?: Date;
    symptoms: string[];
} 