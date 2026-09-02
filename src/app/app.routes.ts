import { Routes } from '@angular/router';
import { roleGuard } from './core';

export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  {
    path: 'inicio',
    loadComponent: () => import('./pages/inicio/inicio.component').then((m) => m.InicioComponent),
  },
  {
    path: 'perfil',
    canActivate: [roleGuard],
    data: { roles: ['estudiante'] },
    loadComponent: () => import('./pages/perfil/perfil.component').then((m) => m.PerfilComponent),
  },
  {
    path: 'portafolio',
    canActivate: [roleGuard],
    data: { roles: ['estudiante'] },
    loadComponent: () => import('./pages/portafolio/portafolio.component').then((m) => m.PortafolioComponent),
  },
  {
    path: 'prototipos',
    canActivate: [roleGuard],
    data: { roles: ['estudiante'] },
    loadComponent: () => import('./pages/prototipos/prototipos.component').then((m) => m.PrototiposComponent),
  },
  {
    path: 'ofertas',
    canActivate: [roleGuard],
    data: { roles: ['estudiante', 'empresa'] },
    loadComponent: () => import('./pages/ofertas/ofertas.component').then((m) => m.OfertasComponent),
  },
  {
    path: 'postulaciones',
    canActivate: [roleGuard],
    data: { roles: ['estudiante'] },
    loadComponent: () => import('./pages/postulaciones/postulaciones.component').then((m) => m.PostulacionesComponent),
  },
  {
    path: 'reportes',
    canActivate: [roleGuard],
    data: { roles: ['administrador'] },
    loadComponent: () => import('./pages/reportes/reportes.component').then((m) => m.ReportesComponent),
  },
  { path: '**', redirectTo: 'inicio' },
];
