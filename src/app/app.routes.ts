import { Routes } from '@angular/router';

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
    path:"principal",
    loadComponent: () => import('./principal/principal.component').then((m) => m.PrincipalComponent),
  },
  {
    path:"modificarperfil",
    loadComponent: () => import('./modificarperfil/modificarperfil.component').then((m) => m.ModificarperfilComponent),
  },
  {
    path:"paneladmin",
    loadComponent: () => import('./paneladmin/paneladmin.component').then((m) => m.PaneladminComponent),
  },
  {
    path:"carrousel",
    loadComponent: () => import('./carrousel/carrousel.component').then((m) => m.CarrouselComponent),
  },
  {
    path:"ofertasguardadas",
    loadComponent: () => import('./ofertasguardadas/ofertasguardadas.component').then((m) => m.OfertasguardadasComponent),
  },
  {
    path:"historial",
    loadComponent: () => import('./historial/historial.component').then((m) => m.HistorialComponent),
  },
  {
    path:"ajustes",
    loadComponent: () => import('./ajustes/ajustes.component').then((m) => m.AjustesComponent),
  },

  {
    path:"alertas",
    loadComponent: () => import('./alertas/alertas.component').then((m) => m.AlertasComponent),
  },
];
