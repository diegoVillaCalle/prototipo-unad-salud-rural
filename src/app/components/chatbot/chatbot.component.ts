import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotService } from '../../services/chatbot.service';
import { ChatMessage } from '../../models/chat.model';

@Component({
    selector: 'app-chatbot',
    templateUrl: './chatbot.component.html',
    styleUrls: ['./chatbot.component.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule]
})
export class ChatbotComponent implements OnInit, AfterViewChecked {
    @ViewChild('chatContainer') private chatContainer!: ElementRef;
    
    messages: ChatMessage[] = [];
    newMessage: string = '';
    isMinimized: boolean = true;
    isLoading: boolean = false;

    constructor(private chatbotService: ChatbotService) {}

    ngOnInit() {
        this.chatbotService.messages$.subscribe(messages => {
            this.messages = messages;
            this.scrollToBottom();
        });
    }

    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    private scrollToBottom(): void {
        try {
            this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
        } catch(err) {}
    }

    toggleChat() {
        this.isMinimized = !this.isMinimized;
        if (!this.isMinimized) {
            setTimeout(() => this.scrollToBottom(), 100);
        }
    }

    sendMessage() {
        if (!this.newMessage.trim()) return;

        this.isLoading = true;
        this.chatbotService.sendMessage(this.newMessage).subscribe(() => {
            this.newMessage = '';
            this.isLoading = false;
        });
    }

    selectOption(option: string) {
        this.isLoading = true;
        this.chatbotService.selectOption(option).subscribe(() => {
            this.isLoading = false;
        });
    }

    endChat() {
        this.chatbotService.endSession();
        this.isMinimized = true;
    }
} 