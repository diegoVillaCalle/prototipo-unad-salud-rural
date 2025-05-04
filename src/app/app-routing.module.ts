import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { 
    path: '', 
    redirectTo: '/home', 
    pathMatch: 'full' 
  },
  { 
    path: 'home', 
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule) 
  },
  { 
    path: 'registro', 
    loadChildren: () => import('./pages/registro/registro.module').then(m => m.RegistroModule),
    canActivate: [AuthGuard]
  },
  { 
    path: 'resultado', 
    loadChildren: () => import('./pages/resultado/resultado.module').then(m => m.ResultadoModule),
    canActivate: [AuthGuard]
  },
  { 
    path: 'teleconsulta', 
    loadChildren: () => import('./pages/teleconsulta/teleconsulta.module').then(m => m.TeleconsultaModule),
    canActivate: [AuthGuard]
  },
  { 
    path: 'historial', 
    loadChildren: () => import('./pages/historial/historial.module').then(m => m.HistorialModule),
    canActivate: [AuthGuard]
  },
  { 
    path: 'perfil', 
    loadChildren: () => import('./pages/perfil/perfil.module').then(m => m.PerfilModule),
    canActivate: [AuthGuard]
  },
  { 
    path: 'buscar', 
    loadChildren: () => import('./pages/buscar/buscar.module').then(m => m.BuscarModule),
    canActivate: [AuthGuard]
  },
  { 
    path: 'notificaciones', 
    loadChildren: () => import('./pages/notificaciones/notificaciones.module').then(m => m.NotificacionesModule),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: '/home'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { } 