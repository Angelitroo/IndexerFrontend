import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class AlertaService {

  private apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient, private authService: AuthService) {}

  crearAlerta(alerta: Partial<{ concepto: string, precio: number }>) {
    const options = this.authService.getAuthHeaders();
    return this.httpClient.post(`${this.apiUrl}/alertas/crear/`, alerta, options);
  }
}
