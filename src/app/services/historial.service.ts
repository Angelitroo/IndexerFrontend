import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Busqueda } from '../models/Busqueda';


export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}


interface SearchHistoryRaw {
  id: number;
  searchQuery: string;
  searchTimestamp: string;
}


@Injectable({
  providedIn: 'root'
})
export class HistorialService {
  private apiUrl = '/api/scrap/search/history';

  constructor(private http: HttpClient) { }

  getHistorialUsuario(page: number = 0, size: number = 20): Observable<Busqueda[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PaginatedResponse<SearchHistoryRaw>>(this.apiUrl, { params })
      .pipe(
        map(response => response.content.map(item => this.mapToBusqueda(item)))
      );
  }

  deleteHistorialItems(ids: number[]): Observable<void> {
    if (!ids || ids.length === 0) {
      return of(undefined);
    }
    const params = new HttpParams().set('ids', ids.join(','));
    return this.http.delete<void>(this.apiUrl, { params });
  }

  private mapToBusqueda(rawItem: SearchHistoryRaw): Busqueda {
    return {
      id: rawItem.id,
      concepto: rawItem.searchQuery,
      fecha: this.formatFecha(rawItem.searchTimestamp)
    };
  }

  private formatFecha(timestamp: string): string {
    if (!timestamp) {
      return 'Fecha desconocida';
    }
    try {
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${year}-${month}-${day} A las ${hours}:${minutes}`;
    } catch (e) {
      console.error("Error al formatear la fecha:", timestamp, e);
      return timestamp;
    }
  }
}
