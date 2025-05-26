import { Component, OnInit, AfterViewInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { addIcons } from "ionicons";
import { notificationsOutline, personCircleOutline } from "ionicons/icons";

import { Producto } from '../models/Producto';
import { ProductFilters } from '../models/ProductFilters';
import { MenuizquierdaComponent } from "../menuizquierda/menuizquierda.component";
import { finalize } from 'rxjs/operators';
import {RouterLink} from "@angular/router";
import {SwiperModule} from "swiper/angular";


interface BackendProduct {
  id?: any;
  title: string;
  discount: string;
  actualPrice: number;
  oldPrice?: number;
  image: string;
  rating: string;
  delivery: string;
  url: string;
  urlProduct?: string;
  empresa: string;
  source?: string;
}


@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    MenuizquierdaComponent,
    HttpClientModule,
    RouterLink,
    SwiperModule
  ],
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss']
})
export class PrincipalComponent implements OnInit, AfterViewInit {
  availableEmpresas: string[] = ['Amazon', 'eBay', 'AliExpress', 'PCComponentes', 'MediaMarkt', 'Carrefour', 'El Corte Inglés'];

  initialEmpresas: string[] = [];
  initialHardcodedProductos: Producto[] = [];

  allProducts: Producto[] = [];
  groupedProducts: { empresa: string, items: Producto[] }[] = [];

  searchTerm: string = '';
  activeFilters: ProductFilters = {};
  isLoading: boolean = false;
  isInitialView: boolean = true;

  private currentSearchCallId = 0;
  private apiUrl = 'http://localhost:8080/scrap/search';

  @ViewChildren('scrollArea') scrollAreas!: QueryList<ElementRef<HTMLElement>>;

  constructor(private http: HttpClient) {
    addIcons({
      'person-circle-outline': personCircleOutline,
      'notifications-outline': notificationsOutline
    });
  }

  ngOnInit() {
    this.isInitialView = true;
    this.initializeHardcodedData();
    this.allProducts = [...this.initialHardcodedProductos];
    this.initialEmpresas = this.availableEmpresas.filter(empresa =>
      this.initialHardcodedProductos.some(p => p.empresa === empresa)
    );
    if (this.initialEmpresas.length === 0 && this.initialHardcodedProductos.length > 0) {
      const uniqueEmpresas = new Set(this.initialHardcodedProductos.map(p => p.empresa));
      this.initialEmpresas = Array.from(uniqueEmpresas);
    }
    this.processProducts();
  }

  ngAfterViewInit() {
    this.scrollAreas.changes.subscribe((list: QueryList<ElementRef<HTMLElement>>) => {
      this.attachWheelListeners(list);
    });
    this.attachWheelListeners(this.scrollAreas);
  }

  private attachWheelListeners(list: QueryList<ElementRef<HTMLElement>>) {
    list.forEach((areaRef) => {
      const area = areaRef.nativeElement;
      area.addEventListener(
        'wheel',
        (e: WheelEvent) => {
          if (e.deltaY !== 0) {
            e.preventDefault();
            area.scrollLeft += e.deltaY;
          }
        },
        { passive: false }
      );
    });
  }

  private initializeHardcodedData() {
    this.initialHardcodedProductos = [
      {
        id: 1, title: 'Auriculares Bluetooth', discount: '20%', actualPrice: 29.99, oldPrice: 39.99,
        image: 'https://www.energysistem.com/cdnassets/products/45839/serie_2000.webp?2/d/8/1/2d818c47d79454c36d45c0f6cdb63cd0311b1729_Silent_ANC__45839_B2B_principal.jpg',
        rating: '4.5', delivery: 'Entrega rápida', url: '#', empresa: 'Amazon'
      },
      {
        id: 2, title: 'Teclado Mecánico', discount: '15%', actualPrice: 59.99, oldPrice: 69.99,
        image: 'https://m.media-amazon.com/images/I/61Q56A7UfNL.jpg',
        rating: '4.8', delivery: 'Entrega en 24h', url: '#', empresa: 'PCComponentes'
      },
      {
        id: 3, title: 'Smartwatch Deportivo', discount: '10%', actualPrice: 89.99, oldPrice: 99.99,
        image: 'https://correos-marketplace.ams3.cdn.digitaloceanspaces.com/prod-new/uploads/correos-marketplace-shop/1/product/99478-keuadwa8-klack-smartwatch-reloj-inteligente-t500p-deportivo-fitness-hombre-mujer-klack-blanco-1.jpg',
        rating: '4.6', delivery: 'Entrega en 48h', url: '#', empresa: 'AliExpress'
      },
      {
        id: 4, title: 'Cámara Deportiva 4K', discount: '25%', actualPrice: 74.99, oldPrice: 99.99,
        image: 'https://correos-marketplace.ams3.cdn.digitaloceanspaces.com/prod-new/uploads/correos-marketplace-shop/1/product/108041-31wkrigo-klack-camara-deportiva-de-accion-klack-full-hd-1080p-resistente-al-agua-negro-1.jpg',
        rating: '4.7', delivery: 'Entrega en 24h', url: '#', empresa: 'MediaMarkt'
      },
      {
        id: 5, title: 'Altavoz Bluetooth Portátil', discount: '30%', actualPrice: 34.99, oldPrice: 49.99,
        image: 'https://vieta.es/cdn/shop/files/8431543119867_01_030853ba-ca86-469b-8085-e29b77c7b141.jpg?v=1743670682',
        rating: '4.4', delivery: 'Entrega rápida', url: '#', empresa: 'eBay'
      },
      {
        id: 6, title: 'Monitor Full HD 24"', discount: '20%', actualPrice: 119.99, oldPrice: 149.99,
        image: 'https://m.media-amazon.com/images/I/81QpkIctqPL._AC_SL1500_.jpg',
        rating: '4.6', delivery: 'Entrega en 48h', url: '#', empresa: 'Carrefour'
      }
    ];
  }

  public getDiscountValue(discountStr: string | undefined | null): number {
    if (!discountStr || discountStr.toLowerCase() === "no discount" || discountStr.includes("Infinity")) {
      return 0;
    }
    const numericPart = parseFloat(discountStr);
    return isNaN(numericPart) ? 0 : numericPart;
  }


  onSearchChange(event: any) {
    const query = event.target.value ? event.target.value.toLowerCase() : '';
    this.searchTerm = query;

    this.currentSearchCallId++;
    const localCallId = this.currentSearchCallId;

    if (!query) {
      this.isInitialView = true;
      this.allProducts = [...this.initialHardcodedProductos];
      this.processProducts();
      this.isLoading = false;
      return;
    }

    this.isInitialView = false;
    this.isLoading = true;

    this.http.get<BackendProduct[]>(`${this.apiUrl}/${query}`)
      .pipe(
        finalize(() => {
          if (localCallId === this.currentSearchCallId) {
            this.isLoading = false;
          }
        })
      )
      .subscribe({
        next: (data) => {
          if (localCallId === this.currentSearchCallId) {
            this.allProducts = data.map((p: BackendProduct, index: number) => ({
              id: p.id || (Date.now() + index),
              title: p.title || 'No Title',
              discount: p.discount || '',
              actualPrice: p.actualPrice || 0,
              oldPrice: p.oldPrice || p.actualPrice || 0,
              image: p.image || 'assets/placeholder.png',
              rating: p.rating || 'N/A',
              delivery: p.delivery || 'No delivery info',
              url: p.url || p.urlProduct || '#',
              empresa: p.empresa || p.source || 'Desconocido'
            }));
            this.processProducts();
          }
        },
        error: (err) => {
          if (localCallId === this.currentSearchCallId) {
            console.error(`Error fetching products for query "${query}":`, err);
            this.allProducts = [];
            this.processProducts();
          }
        }
      });
  }

  onFiltersChanged(filters: ProductFilters) {
    this.activeFilters = filters;
    this.isInitialView = false;
    this.processProducts();
  }

  private processProducts() {
    let productsToDisplay = [...this.allProducts];


    if (this.activeFilters.selectedCategories && this.activeFilters.selectedCategories.length > 0) {
      productsToDisplay = productsToDisplay.filter(p => {

        return true;
      });
    }

    if (this.activeFilters.minPrice !== undefined && this.activeFilters.minPrice !== null) {
      productsToDisplay = productsToDisplay.filter(p => p.actualPrice >= this.activeFilters.minPrice!);
    }
    if (this.activeFilters.maxPrice !== undefined && this.activeFilters.maxPrice !== null) {
      productsToDisplay = productsToDisplay.filter(p => p.actualPrice <= this.activeFilters.maxPrice!);
    }

    if (this.activeFilters.sortBy) {
      switch (this.activeFilters.sortBy) {
        case 'precio-asc':
          productsToDisplay.sort((a, b) => a.actualPrice - b.actualPrice);
          break;
        case 'precio-desc':
          productsToDisplay.sort((a, b) => b.actualPrice - a.actualPrice);
          break;
        case 'popularidad':

          productsToDisplay.sort((a, b) => (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0));
          break;
        case 'novedades':
          console.warn("'Novedades' sort selected, but no specific logic implemented. Products may not be sorted by newness.");
          break;
      }
    }

    const grouped = new Map<string, Producto[]>();
    productsToDisplay.forEach(product => {
      const empresaKey = product.empresa || 'Otros';
      if (!grouped.has(empresaKey)) {
        grouped.set(empresaKey, []);
      }
      grouped.get(empresaKey)!.push(product);
    });

    let relevantEmpresas = [...this.availableEmpresas];
    this.groupedProducts = relevantEmpresas.map(empresaName => ({
      empresa: empresaName,
      items: grouped.get(empresaName) || []
    })).sort((a,b) => {
      let idxA = this.availableEmpresas.indexOf(a.empresa);
      let idxB = this.availableEmpresas.indexOf(b.empresa);
      if (idxA === -1) idxA = Infinity;
      if (idxB === -1) idxB = Infinity;
      return idxA - idxB;
    });

    const otherKey = 'Desconocido';
    if (grouped.has(otherKey) && (grouped.get(otherKey)?.length ?? 0) > 0) {
      const existingOtherGroup = this.groupedProducts.find(g => g.empresa === otherKey);
      if (!existingOtherGroup) {
        this.groupedProducts.push({
          empresa: otherKey,
          items: grouped.get(otherKey)!
        });
      } else if (existingOtherGroup.items.length === 0) {
        existingOtherGroup.items = grouped.get(otherKey)!;
      }
    }
  }

  hasProductsToDisplay(): boolean {
    return this.groupedProducts.some(group => group.items.length > 0);
  }
}
