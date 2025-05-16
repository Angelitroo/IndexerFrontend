import { Injectable } from '@angular/core';
import {AuthService} from "./auth.service";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Producto} from "../models/Producto";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient, private authService: AuthService) {}

  guardarProducto(id: number, producto: Partial<Producto>): Observable<Producto> {
    const options = this.authService.getAuthHeaders();
    return this.httpClient.post<Producto>(`${this.apiUrl}/productos/guardar/${id}`, producto, options);
  }
}
