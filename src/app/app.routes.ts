import { Routes } from '@angular/router';
import { AdminGuard } from './guards/admin.guard';
import {BaneadoGuard} from "./guards/baneado.guard";

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: "principal",
    loadComponent: () => import('./principal/principal.component').then((m) => m.PrincipalComponent),
    canActivate: [BaneadoGuard]
  },
  {
    path: "modificarperfil",
    loadComponent: () => import('./modificarperfil/modificarperfil.component').then((m) => m.ModificarperfilComponent),
    canActivate: [BaneadoGuard]
  },
  {
    path: "paneladmin",
    loadComponent: () => import('./paneladmin/paneladmin.component').then((m) => m.PaneladminComponent),
    canActivate: [AdminGuard]
  },
  {
    path: "ofertasguardadas",
    loadComponent: () => import('./ofertasguardadas/ofertasguardadas.component').then((m) => m.OfertasguardadasComponent),
    canActivate: [BaneadoGuard]
  },
  {
    path: "historial",
    loadComponent: () => import('./historial/historial.component').then((m) => m.HistorialComponent),
    canActivate: [BaneadoGuard]
  },
  {
    path: "ajustes",
    loadComponent: () => import('./ajustes/ajustes.component').then((m) => m.AjustesComponent),
    canActivate: [BaneadoGuard]
  },
  {
    path: "alertas",
    loadComponent: () => import('./alertas/alertas.component').then((m) => m.AlertasComponent),
    canActivate: [BaneadoGuard]
  },
];
