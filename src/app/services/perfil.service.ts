import { Injectable } from '@angular/core';
import {AuthService} from "./auth.service";
import {HttpClient} from "@angular/common/http";
import {Perfil} from "../models/Perfil";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class PerfilService {

  private apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient, private authService:AuthService) {}

  getPerfiles(): Observable<Perfil[]> {
    const options = this.authService.getAuthHeaders();
    return this.httpClient.get<Perfil[]>(`${this.apiUrl}/perfiles/`, options);
  }

  getPerfilById(id: number): Observable<Perfil> {
    const options = this.authService.getAuthHeaders();
    return this.httpClient.get<Perfil>(`${this.apiUrl}/perfiles/${id}`, options);
  }

  buscarPorNombre(nombre: string): Observable<Perfil[]> {
    const options = this.authService.getAuthHeaders();
    return this.httpClient.get<Perfil[]>(`${this.apiUrl}/perfiles/buscar/${nombre}`, options);
  }

}

