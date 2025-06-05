import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { Observable } from "rxjs";
import { Alerta } from "../models/Alerta";

@Injectable({
  providedIn: 'root'
})
export class AlertaService {

  private apiUrl = `${environment.apiUrl}/api/alertas`;

  constructor(private httpClient: HttpClient, private authService: AuthService) {}

  getAlertas(): Observable<Alerta[]> {
    const options = this.authService.getAuthHeaders();
    return this.httpClient.get<Alerta[]>(this.apiUrl, options);
  }

  crearAlerta(alerta: Partial<Alerta>): Observable<Alerta> {
    const options = this.authService.getAuthHeaders();
    return this.httpClient.post<Alerta>(this.apiUrl, alerta, options);
  }

  eliminarAlerta(id: number): Observable<void> {
    const options = this.authService.getAuthHeaders();
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`, options);
  }
}
