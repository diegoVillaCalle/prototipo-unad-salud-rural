import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: '/home', 
    pathMatch: 'full' 
  },
  { 
    path: 'home', 
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  { 
    path: 'registro', 
    loadComponent: () => import('./pages/registro/registro.component').then(m => m.RegistroComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'resultado', 
    loadComponent: () => import('./pages/resultado/resultado.component').then(m => m.ResultadoComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'teleconsulta', 
    loadComponent: () => import('./pages/teleconsulta/teleconsulta.component').then(m => m.TeleconsultaComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'historial', 
    loadComponent: () => import('./pages/historial/historial.component').then(m => m.HistorialComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'perfil', 
    loadComponent: () => import('./pages/perfil/perfil.component').then(m => m.PerfilComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'buscar', 
    loadComponent: () => import('./pages/buscar/buscar.component').then(m => m.BuscarComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'notificaciones', 
    loadComponent: () => import('./pages/notificaciones/notificaciones.component').then(m => m.NotificacionesComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'login', 
    loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '**',
    redirectTo: '/home'
  }
];
