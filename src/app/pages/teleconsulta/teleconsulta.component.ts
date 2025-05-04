import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-teleconsulta',
  template: `
    <div class="container">
      <h2>Teleconsulta</h2>
      <p>Módulo de teleconsulta en construcción...</p>
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
export class TeleconsultaComponent {
  constructor() { }
} 