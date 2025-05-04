import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.component.html',
  styleUrls: ['./buscar.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class BuscarComponent implements OnInit {
  searchControl = new FormControl('');
  loading = false;
  results: any[] = [];

  constructor() {}

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(value => {
        if (value) {
          this.search(value);
        } else {
          this.results = [];
        }
      });
  }

  private search(query: string): void {
    this.loading = true;
    // Aquí iría la lógica de búsqueda real
    // Por ahora solo simulamos resultados
    setTimeout(() => {
      this.results = [
        {
          type: 'consulta',
          title: 'Consulta del 15/03/2024',
          description: 'Consulta por síntomas respiratorios'
        },
        {
          type: 'medicamento',
          title: 'Paracetamol 500mg',
          description: 'Medicamento recetado el 15/03/2024'
        },
        {
          type: 'doctor',
          title: 'Dr. Juan Pérez',
          description: 'Medicina General'
        }
      ].filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
      );
      this.loading = false;
    }, 500);
  }
} 