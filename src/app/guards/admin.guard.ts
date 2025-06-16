import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { PerfilService } from "../services/perfil.service";

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private perfilService: PerfilService
  ) {}

  canActivate(): boolean {
    if (this.authService.esAdmin()) {
      return true;
    } else {
      this.router.navigate(['/principal']);
      return false;
    }
  }
}
