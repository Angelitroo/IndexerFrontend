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
    path: "registro",
    loadComponent: () => import('./registro/registro.component').then((m) => m.RegistroComponent),
  },
  {
    path:"principal",
    loadComponent: () => import('./principal/principal.component').then((m) => m.PrincipalComponent),
  }
];
