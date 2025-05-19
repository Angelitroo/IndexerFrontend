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
    path:"crearproducto",
    loadComponent: () => import('./crearproducto/crearproducto.component').then((m) => m.CrearproductoComponent),
  },
  {
    path:"carrousel",
    loadComponent: () => import('./carrousel/carrousel.component').then((m) => m.CarrouselComponent),
  },
];
