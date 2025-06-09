import { Injectable } from '@angular/core';
import { AuthService } from "./auth.service";
import { HttpClient } from "@angular/common/http";
import { Perfil } from "../models/Perfil";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { PerfilActualizar } from "../models/PerfilActualizar";
import {PerfilFull} from "../models/PerfilFull";

@Injectable({
  providedIn: 'root'
})
export class PerfilService {
  private apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient, private authService: AuthService) {}

  actualizarPerfil(perfil: PerfilActualizar): Observable<Perfil> {
    const options = this.authService.getAuthHeaders();
    return this.httpClient.put<Perfil>(`${this.apiUrl}/perfiles/actualizar/${perfil.id}`, perfil, options);
  }

  getPerfiles(): Observable<PerfilFull[]> {
    const options = this.authService.getAuthHeaders();
    return this.httpClient.get<PerfilFull[]>(`${this.apiUrl}/perfiles/`, options);
  }

  getPerfilById(id: number): Observable<Perfil> {
    const options = this.authService.getAuthHeaders();
    return this.httpClient.get<Perfil>(`${this.apiUrl}/perfiles/${id}`, options);
  }
  getActualizadoById(id: number): Observable<PerfilActualizar> {
    const options = this.authService.getAuthHeaders();
    return this.httpClient.get<PerfilActualizar>(`${this.apiUrl}/perfiles/actualizado/${id}`, options);
  }

  eliminarPerfil(id: number): Observable<string> {
    const options = {
      ...this.authService.getAuthHeaders(),
      responseType: 'text' as const
    };
    return this.httpClient.delete(
      `${this.apiUrl}/perfiles/eliminar/${id}`,
      options
    ) as Observable<string>;
  }

  buscarPorNombre(nombre: string): Observable<PerfilFull[]> {
    const options = this.authService.getAuthHeaders();
    return this.httpClient.get<PerfilFull[]>(`${this.apiUrl}/perfiles/buscar/${nombre}`, options);
  }


  enviarCorreoBaneo(perfilId: number): Observable<string> {
    const options = {
      ...this.authService.getAuthHeaders(),
      responseType: 'text' as const
    };
    return this.httpClient.post(
      `${this.apiUrl}/perfiles/baneo/${perfilId}`,
      {},
      options
    ) as Observable<string>;
  }

  enviarCorreoDesbaneo(perfilId: number): Observable<string> {
    const options = {
      ...this.authService.getAuthHeaders(),
      responseType: 'text' as const
    };
    return this.httpClient.post(
      `${this.apiUrl}/perfiles/desbaneo/${perfilId}`,
      {},
      options
    ) as Observable<string>;
  }
}
