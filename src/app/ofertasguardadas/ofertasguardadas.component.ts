import {Component, ElementRef, OnInit, QueryList, ViewChildren} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { MenuizquierdaconfigComponent } from '../menuizquierdaconfig/menuizquierdaconfig.component';
import { NgForOf, NgIf, CommonModule } from '@angular/common';
import { Producto } from '../models/Producto';
import { SwiperModule, SwiperComponent } from 'swiper/angular';
import SwiperCore, { Navigation, Pagination, Autoplay } from 'swiper';
import {addIcons} from "ionicons";
import {heart, heartOutline} from "ionicons/icons";
import {HttpClient, HttpClientModule, HttpParams} from '@angular/common/http';
import {ProductAdmin} from "../models/ProductAdmin";

SwiperCore.use([Navigation, Pagination]);

@Component({
  selector: 'app-ofertasguardadas',
  templateUrl: './ofertasguardadas.component.html',
  styleUrls: ['./ofertasguardadas.component.scss'],
  standalone: true,
  imports: [
    MenuizquierdaconfigComponent,
    IonicModule,
    NgForOf,
    NgIf,
    CommonModule,
    SwiperModule,
    HttpClientModule
  ]
})
export class OfertasguardadasComponent implements OnInit {
  modo: boolean = true;
  productos: Producto[] = [];
  isLoading: boolean = false;
  errorMessage: string | null = null;

  private favoritesApiBaseUrl = 'http://localhost:8080/api/products';

  constructor(private http: HttpClient) {
    addIcons({
      'heart-outline': heartOutline,
      'heart': heart
    });
  }

  @ViewChildren('scrollArea') scrollAreas!: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren(SwiperComponent) swiperInstances!: QueryList<SwiperComponent>;

  slidesPerView = 5;
  swiperBreakpoints = {
    320: { slidesPerView: 1 },
    880: { slidesPerView: 1 },
    1000: { slidesPerView: 2 },
    1050: { slidesPerView: 3 },
    1280: { slidesPerView: 4 },
    1420: { slidesPerView: 5 },
  };


  ngOnInit() {
    const modoGuardado = localStorage.getItem('modo');
    if (modoGuardado !== null) {
      this.modo = JSON.parse(modoGuardado);
    } else {
      this.modo = true;
    }
    this.loadFavoritos();
  }

  loadFavoritos(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.http.get<Producto[]>(`${this.favoritesApiBaseUrl}/favorites`).subscribe({
      next: (data) => {
        this.productos = data.map(p => ({ ...p, favorito: true }));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading saved offers:', err);
        this.isLoading = false;
        if (err.status === 401) {
          this.errorMessage = 'Please log in to view your saved offers.';
        } else {
          this.errorMessage = 'Could not load saved offers. Please try again later.';
        }
      }
    });
  }

  toggleFavorito(producto: Producto | ProductAdmin): void {
    const productUrlValue = producto.url;
    if (!productUrlValue || productUrlValue === '#') {
      console.error('Cannot unfavorite: Product URL is missing or invalid.', producto);
      return;
    }

    const productIndex = this.productos.findIndex(p => p.url === productUrlValue);
    if (productIndex === -1) return;
    const originalProduct = this.productos[productIndex];
    this.productos.splice(productIndex, 1);

    const requestUrl = `${this.favoritesApiBaseUrl}/favorite`;
    const params = new HttpParams().set('url', productUrlValue);

    this.http.delete(requestUrl, { params: params }).subscribe({
      next: () => {
        console.log(`Product ${productUrlValue} successfully removed from favorites.`);
      },
      error: (err) => {
        console.error(`Error removing favorite ${productUrlValue} from backend:`, err);
        this.productos.splice(productIndex, 0, originalProduct);

        if (err.status === 401) {
          alert('Your session might have expired. Please log in again.');
        } else {
          alert('Failed to remove favorite. Please try again.');
        }
      }
    });
  }
}
