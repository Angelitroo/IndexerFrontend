import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable} from "rxjs";
import {Router} from "@angular/router";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;

  private readonly TOKEN_KEY = 'authToken';

  private authState = new BehaviorSubject<boolean>(!!localStorage.getItem('authToken'));
  authState$ = this.authState.asObservable();

  constructor(private httpClient: HttpClient, private route: Router) {}

  esAdmin(): boolean {
    const token = this.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.tokenDataDTO?.rol === 'ADMIN';
      } catch (e) {
        console.error('Error extracting perfilId from token', e);
        return false;
      }
    }
    return false;
  }

  getIdActivarCuenta(token: string): number | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.tokenDataDTO?.id || null;
    } catch (e) {
      console.error('Error extracting perfilId from token', e);
      return null;
    }
  }

  activarCuenta(idPerfil: number): Observable<any> {
    const options = this.getAuthHeaders();
    return this.httpClient.put(`${this.apiUrl}/auth/activar`, { idPerfil }, options);
  }

  cerrarSesion(){
    localStorage.removeItem('authToken');
    this.route.navigate(['/inicio-sesion']);
  }

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getAuthHeaders(): { headers: HttpHeaders } {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return { headers };
  }

  getPerfilIdFromToken(): number | null {
    const token = this.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.tokenDataDTO?.id || null;
      } catch (e) {
        console.error(e);
        return null;
      }
    }
    return null;
  }

  recuperarContrasena(email: string): Observable<any> {
    const options = this.getAuthHeaders();
    return this.httpClient.post(`${this.apiUrl}/auth/recuperar-contrasena`, { email }, options);
  }

  restablecerContrasena(token: string, newPassword: string): Observable<any> {
    const options = this.getAuthHeaders();
    return this.httpClient.post(`${this.apiUrl}/auth/restablecer-contrasena`, { token, newPassword }, options);
  }
}
