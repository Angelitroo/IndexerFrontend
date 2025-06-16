import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { PerfilService } from "../services/perfil.service";
import {Observable, of} from "rxjs";
import {catchError, map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class BaneadoGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private perfilService: PerfilService
  ) {}

  canActivate(): Observable<boolean> {
    const perfilId = this.authService.getPerfilIdFromToken();

    if (perfilId === null) {
      this.router.navigate(['/login']);
      return of(true);
    }

    return this.perfilService.getPerfilById(perfilId).pipe(
      map(perfil => {
        if (perfil.baneado) {
          this.router.navigate(['/login']);
          console.log("tas baneado");
          return false; // No dejar pasar si está baneado
        }
        return true; // ✅ Dejar pasar si NO está baneado
      }),
      catchError(error => {
        console.error('Error al obtener el perfil:', error);
        this.router.navigate(['/login']);
        return of(false); // No dejar pasar si hay error
      })
    );
  }
}
