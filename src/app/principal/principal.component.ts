import { Component, OnInit, AfterViewInit, ElementRef, QueryList, ViewChildren, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import {HttpClient, HttpClientModule, HttpParams} from '@angular/common/http';
import { RouterLink } from "@angular/router";

import { SwiperModule, SwiperComponent } from 'swiper/angular';
import SwiperCore, { Navigation, Pagination, SwiperOptions, Autoplay } from 'swiper';

import { addIcons } from "ionicons";
import {notificationsOutline, personCircleOutline, heartOutline, heart, searchOutline} from "ionicons/icons";
import { finalize } from 'rxjs/operators';

import { PopoverController } from '@ionic/angular';
import { MenuizquierdaComponent } from "../menuizquierda/menuizquierda.component";
import { CrearalertapopoverComponent } from "../crearalertapopover/crearalertapopover.component";
import { Producto } from '../models/Producto';
import { ProductFilters } from '../models/ProductFilters';

SwiperCore.use([Navigation, Pagination, Autoplay]);

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
  favorito?: boolean;
}

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    HttpClientModule,
    RouterLink,
    SwiperModule,
    MenuizquierdaComponent
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
  modo: boolean = true;

  private currentSearchCallId = 0;
  private searchApiUrl = 'http://localhost:8080/scrap/search';
  private favoriteApiBaseUrl = 'http://localhost:8080/api/products/favorite';

  @ViewChildren('scrollArea') scrollAreas!: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren(SwiperComponent) swiperInstances!: QueryList<SwiperComponent>;

  swiperConfig: SwiperOptions = {
    navigation: true,
    pagination: { clickable: true },
    loop: false,
    slidesPerGroup: 1,
    breakpoints: {
      '320': { slidesPerView: 1, spaceBetween: 10 },
      '480': { slidesPerView: 2, spaceBetween: 10 },
      '768': { slidesPerView: 3, spaceBetween: 5 },
      '992': { slidesPerView: 4, spaceBetween: 5 },
      '1200': { slidesPerView: 5, spaceBetween: 2 }
    },
    observer: true,
    observeParents: true,
    observeSlideChildren: true,
  };

  destacados: Producto[] = [
    {
      id: 1,
      favorito: false,
      title: 'Auriculares To Wapos',
      discount: '20%',
      actualPrice: 29.99,
      oldPrice: 39.99,
      image: 'https://canarias.worten.es/i/ff5b01f16dddc7df279533f12f08f5e2f96fb153',
      rating: '4.5',
      delivery: 'Entrega rápida o lo antes posible no se lo que me salga de los co',
      url: 'https://amzn.eu/d/19sWE1t',
      empresa: 'Amazon'
    },
    {
      id: 2,
      favorito: false,
      title: 'Teclado De Luces',
      discount: '15%',
      actualPrice: 59.99,
      oldPrice: 69.99,
      image: 'https://m.media-amazon.com/images/I/61Q56A7UfNL.jpg',
      rating: '4.8',
      delivery: 'Entrega en 24h',
      url: 'https://m.media-amazon.com/images/I/61Q56A7UfNL.jpg',
      empresa: 'PCComponentes'
    }
  ];

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private popoverCtrl: PopoverController

  ) {
    addIcons({
      'person-circle-outline': personCircleOutline,
      'notifications-outline': notificationsOutline,
      'heart-outline': heartOutline,
      'heart': heart,
      'search-outline': searchOutline,
    });
  }

  ngOnInit() {
    console.log("--- ngOnInit START ---");
    this.isInitialView = true;
    this.initializeHardcodedData();
    this.allProducts = [...this.initialHardcodedProductos];

    const uniqueInitialEmpresas = new Set(this.initialHardcodedProductos.map(p => p.empresa).filter(Boolean) as string[]);
    this.initialEmpresas = this.availableEmpresas.filter(empresa => uniqueInitialEmpresas.has(empresa));
    uniqueInitialEmpresas.forEach(empresa => {
      if (empresa && !this.initialEmpresas.includes(empresa)) {
        this.initialEmpresas.push(empresa);
      }
    });
    this.processProducts();

    const modoGuardado = localStorage.getItem('modo');
    if (modoGuardado !== null) {
      this.modo = JSON.parse(modoGuardado);
    } else {
      this.modo = true;
    }
    console.log("--- ngOnInit END ---");
  }

  ngAfterViewInit() {
    console.log("--- ngAfterViewInit START ---");
    this.attachWheelListeners(this.scrollAreas);
    this.updateSwipers();
    this.swiperInstances.changes.subscribe(() => {
      this.updateSwipers();
    });
    console.log("--- ngAfterViewInit END ---");
  }

  private attachWheelListeners(list: QueryList<ElementRef<HTMLElement>>) {
    list.forEach((areaRef) => {
      const area = areaRef.nativeElement;
      if (!(area as any).__wheelListenerAttached) {
        area.addEventListener('wheel', (e: WheelEvent) => {
          if (e.deltaY !== 0) { e.preventDefault(); area.scrollLeft += e.deltaY; }
        }, { passive: false });
        (area as any).__wheelListenerAttached = true;
      }
    });
  }

  private initializeHardcodedData() {
    console.log("--- initializeHardcodedData START ---");
    this.initialHardcodedProductos = [
      { id: 1, title: 'Auriculares Bluetooth', discount: '20%', actualPrice: 29.99, oldPrice: 39.99, image: 'https://www.energysistem.com/cdnassets/products/45839/serie_2000.webp?2/d/8/1/2d818c47d79454c36d45c0f6cdb63cd0311b1729_Silent_ANC__45839_B2B_principal.jpg', rating: '4.5', delivery: 'Entrega rápida', url: 'https://example.com/auriculares', empresa: 'Amazon', favorito: false },
      { id: 2, title: 'Teclado Mecánico', discount: '15%', actualPrice: 59.99, oldPrice: 69.99, image: 'https://m.media-amazon.com/images/I/61Q56A7UfNL.jpg', rating: '4.8', delivery: 'Entrega en 24h', url: 'https://example.com/teclado', empresa: 'PCComponentes', favorito: false },
      { id: 3, title: 'Smartwatch Deportivo', discount: '10%', actualPrice: 89.99, oldPrice: 99.99, image: 'https://correos-marketplace.ams3.cdn.digitaloceanspaces.com/prod-new/uploads/correos-marketplace-shop/1/product/99478-keuadwa8-klack-smartwatch-reloj-inteligente-t500p-deportivo-fitness-hombre-mujer-klack-blanco-1.jpg', rating: '4.6', delivery: 'Entrega en 48h', url: 'https://example.com/smartwatch', empresa: 'AliExpress', favorito: false },
      { id: 4, title: 'Cámara Deportiva 4K', discount: '25%', actualPrice: 74.99, oldPrice: 99.99, image: 'https://correos-marketplace.ams3.cdn.digitaloceanspaces.com/prod-new/uploads/correos-marketplace-shop/1/product/108041-31wkrigo-klack-camara-deportiva-de-accion-klack-full-hd-1080p-resistente-al-agua-negro-1.jpg', rating: '4.7', delivery: 'Entrega en 24h', url: 'https://example.com/camara-deportiva', empresa: 'MediaMarkt', favorito: false },
      { id: 5, title: 'Altavoz Bluetooth Portátil', discount: '30%', actualPrice: 34.99, oldPrice: 49.99, image: 'https://vieta.es/cdn/shop/files/8431543119867_01_030853ba-ca86-469b-8085-e29b77c7b141.jpg?v=1743670682', rating: '4.4', delivery: 'Entrega rápida', url: 'https://example.com/altavoz-bluetooth', empresa: 'eBay', favorito: false },
      { id: 6, title: 'Monitor Full HD 24"', discount: '20%', actualPrice: 119.99, oldPrice: 149.99, image: 'https://m.media-amazon.com/images/I/81QpkIctqPL._AC_SL1500_.jpg', rating: '4.6', delivery: 'Entrega en 48h', url: 'https://example.com/monitor-fullhd', empresa: 'Carrefour', favorito: false },
      { id: 7, title: 'Otro Monitor Full HD 24"', discount: '20%', actualPrice: 119.99, oldPrice: 149.99, image: 'https://m.media-amazon.com/images/I/81QpkIctqPL._AC_SL1500_.jpg', rating: '4.6', delivery: 'Entrega en 48h', url: 'https://example.com/monitor-fullhd-otro', empresa: 'El Corte Inglés', favorito: false },
      { id: 8, title: 'Super Auriculares Pro', discount: '10%', actualPrice: 179.99, oldPrice: 199.99, image: 'https://www.energysistem.com/cdnassets/products/45839/serie_2000.webp?2/d/8/1/2d818c47d79454c36d45c0f6cdb63cd0311b1729_Silent_ANC__45839_B2B_principal.jpg', rating: '4.9', delivery: 'Entrega Prioritaria', url: 'https://example.com/super-auriculares', empresa: 'Amazon', favorito: false },
      { id: 9, title: 'Ratón Gaming Ergonómico', discount: '22%', actualPrice: 45.00, oldPrice: 58.00, image: 'https://m.media-amazon.com/images/I/61mKmNUYvrL._AC_SL1500_.jpg', rating: '4.7', delivery: 'Entrega en 24h', url: 'https://example.com/raton-gaming', empresa: 'PCComponentes', favorito: false },
      { id: 10, title: 'Tablet Económica 10"', discount: '5%', actualPrice: 120.50, oldPrice: 126.80, image: 'https://m.media-amazon.com/images/I/616rN2N2WbL._AC_SL1000_.jpg', rating: '4.2', delivery: 'Entrega en 72h', url: 'https://example.com/tablet-eco', empresa: 'AliExpress', favorito: false }
    ];
    console.log("Products defined in initializeHardcodedData:", this.initialHardcodedProductos.length);
    console.log("--- initializeHardcodedData END ---");
  }
  private areFiltersEffectivelyEmpty(filters: ProductFilters): boolean {
    if (!filters || Object.keys(filters).length === 0) {
      return true;
    }
    if (filters.selectedEmpresas && filters.selectedEmpresas.length > 0) return false;
    if (filters.selectedCategories && filters.selectedCategories.length > 0) return false;
    if (filters.minPrice !== undefined && filters.minPrice !== null) return false;
    if (filters.maxPrice !== undefined && filters.maxPrice !== null) return false;
    if (filters.sortBy && filters.sortBy !== '') return false;


    return true;
  }
  private updateSwipers() {
    this.cdr.detectChanges();
    requestAnimationFrame(() => {
      if (this.swiperInstances && this.swiperInstances.length > 0) {
        this.swiperInstances.forEach((swiperInstance: SwiperComponent) => {
          if (swiperInstance && swiperInstance.swiperRef) {
            swiperInstance.swiperRef.update();
            if (swiperInstance.swiperRef.navigation) swiperInstance.swiperRef.navigation.update();
            if (swiperInstance.swiperRef.pagination) swiperInstance.swiperRef.pagination.update();
          }
        });
      }
    });
  }

  public getDiscountValue(discountStr: string | undefined | null): number {
    if (!discountStr || String(discountStr).toLowerCase() === "no discount" || String(discountStr).includes("Infinity") || String(discountStr).trim() === '%') {
      return 0;
    }
    const numericPart = parseFloat(String(discountStr).replace('%', '').trim());
    return isNaN(numericPart) ? 0 : numericPart;
  }


  public onSearchButtonClick(): void {
    const query = this.searchTerm ? this.searchTerm.toLowerCase().trim() : '';
    this.currentSearchCallId++;
    const localCallId = this.currentSearchCallId;


    if (!query && this.areFiltersEffectivelyEmpty(this.activeFilters)) {
      this.isInitialView = true;
      this.allProducts = [...this.initialHardcodedProductos];
      this.processProducts();
      this.isLoading = false;
      return;
    }

    this.isInitialView = false;

    if (query) {
      this.isLoading = true;
      this.http.get<BackendProduct[]>(`${this.searchApiUrl}/${query}`)
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
              this.allProducts = data.map((p: BackendProduct, index: number): Producto => ({
                id: p.id || p.url || (Date.now() + index),
                title: p.title || 'Producto sin título',
                discount: p.discount || '',
                actualPrice: p.actualPrice || 0,
                oldPrice: p.oldPrice,
                image: p.image || 'assets/images/placeholder.png',
                rating: p.rating || undefined,
                delivery: p.delivery || undefined,
                url: p.url || p.urlProduct || '#',
                empresa: p.empresa || p.source || 'Desconocido',
                favorito: p.favorito || false
              }));
              this.processProducts();
            }
          },
          error: (err) => {
            if (localCallId === this.currentSearchCallId) {
              console.error(`Error al buscar productos para "${query}":`, err);
              this.allProducts = [];
              this.processProducts();
            }
          }
        });
    } else {

      this.isLoading = false;
      this.allProducts = [...this.initialHardcodedProductos];
      this.processProducts();
    }
  }

  onFiltersChanged(filters: ProductFilters) {
    this.activeFilters = filters;
    if ((!this.searchTerm || !this.searchTerm.trim()) && this.areFiltersEffectivelyEmpty(this.activeFilters)) {
      this.isInitialView = true;
      this.allProducts = [...this.initialHardcodedProductos];
    } else {
      this.isInitialView = false;
      if (!this.searchTerm || !this.searchTerm.trim()) {
        this.allProducts = [...this.initialHardcodedProductos];
      }
    }
    this.processProducts();
  }

  private processProducts() {

    console.log("--- processProducts START ---");
    let productsToDisplay = [...this.allProducts];


    if (this.activeFilters.selectedEmpresas && this.activeFilters.selectedEmpresas.length > 0) {
      productsToDisplay = productsToDisplay.filter(p =>
        p.empresa && this.activeFilters.selectedEmpresas!.includes(p.empresa)
      );
    }
    if (this.activeFilters.selectedCategories && this.activeFilters.selectedCategories.length > 0) {
      console.warn("Category filtering in processProducts needs implementation based on product data structure.");
    }
    if (this.activeFilters.minPrice !== undefined && this.activeFilters.minPrice !== null) {
      productsToDisplay = productsToDisplay.filter(p => p.actualPrice >= this.activeFilters.minPrice!);
    }
    if (this.activeFilters.maxPrice !== undefined && this.activeFilters.maxPrice !== null) {
      productsToDisplay = productsToDisplay.filter(p => p.actualPrice <= this.activeFilters.maxPrice!);
    }

    if (this.activeFilters.sortBy) {
      switch (this.activeFilters.sortBy) {
        case 'precio-asc': productsToDisplay.sort((a, b) => a.actualPrice - b.actualPrice); break;
        case 'precio-desc': productsToDisplay.sort((a, b) => b.actualPrice - a.actualPrice); break;
        case 'popularidad': productsToDisplay.sort((a, b) => (parseFloat(b.rating || '0')) - (parseFloat(a.rating || '0'))); break;
      }
    }

    const grouped = new Map<string, Producto[]>();
    productsToDisplay.forEach(product => {
      const empresaKey = product.empresa || 'Desconocido';
      if (!grouped.has(empresaKey)) { grouped.set(empresaKey, []); }
      grouped.get(empresaKey)!.push(product);
    });

    this.groupedProducts = this.availableEmpresas
      .map(empresaName => ({ empresa: empresaName, items: grouped.get(empresaName) || [] }))
      .filter(group => group.items.length > 0);

    grouped.forEach((items, empresaName) => {
      if (!this.availableEmpresas.includes(empresaName) && items.length > 0) {
        if (!this.groupedProducts.find(g => g.empresa === empresaName)) {
          this.groupedProducts.push({ empresa: empresaName, items });
        }
      }
    });
    this.cdr.detectChanges();
    this.updateSwipers();
  }

  getProductsForEmpresaInInitialView(empresaName: string): Producto[] {
    return this.initialHardcodedProductos.filter(p => p.empresa === empresaName);
  }

  hasProductsToDisplay(): boolean {
    if (this.isInitialView) {
      return this.initialEmpresas.some(empresa => this.getProductsForEmpresaInInitialView(empresa).length > 0);
    }
    return this.groupedProducts.some(group => group.items.length > 0);
  }

  toggleFavorito(producto: Producto): void {
    console.log('toggleFavorito called for:', JSON.parse(JSON.stringify(producto)));

    if (typeof producto.url !== 'string' || !producto.url || producto.url === '#') {
      console.error('CRITICAL: Product URL is invalid or not a string.', producto.url, producto);
      return;
    }
    const productUrlValue = producto.url;
    console.log('Product URL value:', productUrlValue);

    const originalFavoritoState = producto.favorito;
    producto.favorito = !producto.favorito;
    console.log('New (optimistic) favorito state:', producto.favorito);


    const requestUrl = this.favoriteApiBaseUrl;
    console.log('Request Base URL:', requestUrl);

    const params = new HttpParams().set('url', productUrlValue);
    console.log('Request Params:', params.toString());

    let apiCall;
    if (producto.favorito) {
      console.log('Attempting to ADD favorite (POST)');
      apiCall = this.http.post(requestUrl, {}, { params: params });

    } else {
      console.log('Attempting to REMOVE favorite (DELETE)');
      apiCall = this.http.delete(requestUrl, { params: params });
    }

    console.log("About to subscribe to apiCall for URL:", productUrlValue);
    apiCall.subscribe({
      next: (response) => {
        console.log(`Favorite action successful for ${productUrlValue}`, response);
      },
      error: (err) => {
        console.error(`Favorite action failed for ${productUrlValue}:`, err);
        producto.favorito = originalFavoritoState;
        this.cdr.detectChanges();
      }
    });

    console.log("Subscribed to apiCall");
  }

  async abrirCrearAlerta() {
    // @ts-ignore
    const popover = await this.popoverCtrl.create({
      component: CrearalertapopoverComponent,
      translucent: true,
      componentProps: {
        alerta: null
      }
    });

    popover.onDidDismiss().then((result) => {
      if (result.data) {
        console.log('Alerta creada:', result.data);
      }
    });

    await popover.present();
  }
}
