import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Notification {
  id: number;
  type: 'info' | 'warning' | 'success' | 'danger';
  title: string;
  message: string;
  date: Date;
  read: boolean;
}

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class NotificacionesComponent implements OnInit {
  notifications: Notification[] = [
    {
      id: 1,
      type: 'info',
      title: 'Nueva consulta programada',
      message: 'Tienes una teleconsulta programada para mañana a las 10:00 AM',
      date: new Date(Date.now() - 3600000),
      read: false
    },
    {
      id: 2,
      type: 'warning',
      title: 'Recordatorio de medicación',
      message: 'No olvides tomar tu medicamento en los próximos 30 minutos',
      date: new Date(Date.now() - 7200000),
      read: true
    },
    {
      id: 3,
      type: 'success',
      title: 'Resultados disponibles',
      message: 'Los resultados de tus últimos exámenes están disponibles',
      date: new Date(Date.now() - 86400000),
      read: false
    }
  ];

  constructor() {}

  ngOnInit(): void {}

  markAsRead(notification: Notification): void {
    notification.read = true;
  }

  deleteNotification(id: number): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
  }

  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }
} 