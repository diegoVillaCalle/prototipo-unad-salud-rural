import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from '../models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor() {
    this.currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): Observable<User> {
    // TODO: Implement actual authentication logic
    // This is a mock implementation
    const mockUser: User = {
      id: '1',
      email,
      name: 'Usuario',
      lastName: 'Prueba',
      role: 'patient',
      createdAt: new Date(),
      lastLogin: new Date()
    };

    localStorage.setItem('currentUser', JSON.stringify(mockUser));
    this.currentUserSubject.next(mockUser);
    return of(mockUser);
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  private getUserFromStorage(): User | null {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated(): boolean {
    return !!this.currentUserValue;
  }

  hasRole(role: string): boolean {
    return this.currentUserValue?.role === role;
  }
} 