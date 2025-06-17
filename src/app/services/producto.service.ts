import { Injectable } from '@angular/core';
import { AuthService } from "./auth.service";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";
import { ProductAdmin } from "../models/ProductAdmin";

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient, private authService: AuthService) {}

  addProduct(productadmin: Partial<ProductAdmin>): Observable<ProductAdmin> {
    const options = this.authService.getAuthHeaders();
    return this.httpClient.post<ProductAdmin>(`${this.apiUrl}/api/products/create`, productadmin, options);
  }

  updateProduct(originalUrlIdentifier: string, productData: ProductAdmin): Observable<ProductAdmin> {
    const options = this.authService.getAuthHeaders();
    const url = `${this.apiUrl}/api/products/url?value=${encodeURIComponent(originalUrlIdentifier)}`;
    return this.httpClient.put<ProductAdmin>(url, productData, options);
  }

  deleteProduct(productUrl: string): Observable<void> {
    const options = this.authService.getAuthHeaders();
    return this.httpClient.delete<void>(`${this.apiUrl}/api/products/url?value=${encodeURIComponent(productUrl)}`, options);
  }

  getAllProductsAdmin(): Observable<ProductAdmin[]> {
    const options = this.authService.getAuthHeaders();
    return this.httpClient.get<ProductAdmin[]>(`${this.apiUrl}/api/products/admin`, options);
  }

  getFeaturedProducts(): Observable<ProductAdmin[]> {
    const options = this.authService.getAuthHeaders();
    return this.httpClient.get<ProductAdmin[]>(`${this.apiUrl}/scrap/featured-products`, options);
  }
}
