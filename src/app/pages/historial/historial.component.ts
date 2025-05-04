import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-historial',
  template: `
    <div class="container">
      <h2>Historial Médico</h2>
      <p>Módulo de historial médico en construcción...</p>
    </div>
  `,
  styles: [`
    .container {
      padding: 2rem;
    }
  `],
  standalone: true,
  imports: [CommonModule]
})
export class HistorialComponent {
  constructor() { }
} 