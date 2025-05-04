import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class PerfilComponent implements OnInit {
  perfilForm: FormGroup;
  currentUser: User | null = null;
  loading = false;
  success = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.perfilForm = this.formBuilder.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    if (this.currentUser) {
      this.perfilForm.patchValue({
        name: this.currentUser.name,
        lastName: this.currentUser.lastName,
        email: this.currentUser.email
      });
    }
  }

  onSubmit(): void {
    if (this.perfilForm.invalid) {
      return;
    }

    this.loading = true;
    this.success = false;
    this.error = '';

    // Aquí iría la lógica para actualizar el perfil
    // Por ahora solo simulamos una actualización exitosa
    setTimeout(() => {
      this.loading = false;
      this.success = true;
    }, 1000);
  }
} 