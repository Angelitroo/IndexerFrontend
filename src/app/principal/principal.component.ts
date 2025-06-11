import { Component, OnInit, AfterViewInit, ElementRef, QueryList, ViewChildren, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, PopoverController, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { RouterLink } from "@angular/router";
import { SwiperModule, SwiperComponent } from 'swiper/angular';
import SwiperCore, { Navigation, Pagination, Autoplay } from 'swiper';
import { addIcons } from "ionicons";
import {
  notificationsOutline,
  personCircleOutline,
  heartOutline,
  heart,
  searchOutline,
  filterCircleOutline,
  alarmOutline
} from "ionicons/icons";
import { finalize } from 'rxjs/operators';
import { MenuizquierdaComponent } from "../menuizquierda/menuizquierda.component";
import { CrearalertapopoverComponent } from "../crearalertapopover/crearalertapopover.component";
import { NotificacionespopoverComponent } from "../notificacionespopover/notificacionespopover.component";
import { Producto } from '../models/Producto';
import { ProductFilters } from '../models/ProductFilters';
import { ProductoService } from '../services/producto.service';
import { AlertaService } from '../services/alerta.service';
import { Alerta } from '../models/Alerta';
import { ProductAdmin } from "../models/ProductAdmin";

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
  sourceQualityTag?: string;
}

interface SearchResponseWrapper {
  products: BackendProduct[];
  fromCache: boolean;
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
  availableEmpresas: string[] = ['Amazon', 'eBay', 'PCComponentes', 'MediaMarkt', 'Carrefour', 'El Corte Inglés'];

  private initialDynamicProducts: Producto[] = [];
  allProducts: Producto[] = [];
  groupedProducts: { empresa: string, items: Producto[] }[] = [];

  searchTerm: string = '';
  activeFilters: ProductFilters = {};
  isLoading: boolean = false;
  isInitialView: boolean = true;
  modo: boolean = true;

  notificacionesCount: number = 1;

  private currentSearchCallId = 0;
  private searchApiUrl = 'http://localhost:8080/scrap/search';
  private defaultProductsApiUrl = 'http://localhost:8080/scrap/default-products';
  private favoriteApiBaseUrl = 'http://localhost:8080/api/products/favorite';

  productsadmin: ProductAdmin[] = [];

  @ViewChildren('scrollArea') scrollAreas!: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren(SwiperComponent) swiperInstances!: QueryList<SwiperComponent>;

  slidesPerView = 5;
  swiperBreakpoints = {
    320: { slidesPerView: 1 },
    576: { slidesPerView: 2 },
    768: { slidesPerView: 3 },
    992: { slidesPerView: 4 },
    1200: { slidesPerView: 5 }
  };

  mostrarMenu: boolean = true;

  toggleMenu() {
    this.mostrarMenu = !this.mostrarMenu;
  }

  loadingMessages: string[] = [
    'Cargando productos...',
    'Encontrando las mejores ofertas...',
    'Buscando gangas irresistibles...',
    'Conectando con las tiendas...',
    'Revisando inventarios...',
    'Comparando precios...'
  ];
  currentLoadingMessage: string = this.loadingMessages[0];

  private loadingMessageIndex: number = 0;
  private loadingMessageInterval?: any;

  private startLoadingMessagesRotation(): void {
    this.loadingMessageIndex = 0;
    this.currentLoadingMessage = this.loadingMessages[0];
    this.loadingMessageInterval = setInterval(() => {
      this.loadingMessageIndex = (this.loadingMessageIndex + 1) % this.loadingMessages.length;
      this.currentLoadingMessage = this.loadingMessages[this.loadingMessageIndex];
      this.cdr.detectChanges();
    }, 3500);
  }

  private stopLoadingMessagesRotation(): void {
    if (this.loadingMessageInterval) {
      clearInterval(this.loadingMessageInterval);
      this.loadingMessageInterval = undefined;
    }
  }

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private popoverCtrl: PopoverController,
    private productoService: ProductoService,
    private alertaService: AlertaService,
    private toastController: ToastController,
  ) {
    addIcons({
      'person-circle-outline': personCircleOutline,
      'notifications-outline': notificationsOutline,
      'heart-outline': heartOutline,
      'heart': heart,
      'search-outline': searchOutline,
      'filter-circle-outline': filterCircleOutline,
      'alarm-outline': alarmOutline,
    });
  }

  ngOnInit() {
    this.isInitialView = true;
    this.isLoading = true;
    this.loadInitialDynamicProducts();
    this.cargarProductosAdmin();

    const modoGuardado = localStorage.getItem('modo');
    if (modoGuardado !== null) {
      this.modo = JSON.parse(modoGuardado);
    } else {
      this.modo = true;
    }
  }

  ngAfterViewInit() {
    this.attachWheelListeners(this.scrollAreas);
    this.updateSwipers();
    this.swiperInstances.changes.subscribe(() => {
      this.updateSwipers();
    });
  }

  private async loadInitialDynamicProducts() {
    try {
      const response = await this.http.get<SearchResponseWrapper>(this.defaultProductsApiUrl).toPromise();

      if (response && response.products) {
        const uniqueProducts = response.products.map((p, index) => this.mapBackendProductToProducto(p, index));
        this.allProducts = uniqueProducts;
        this.initialDynamicProducts = [...uniqueProducts];
      } else {
        this.allProducts = [];
        this.initialDynamicProducts = [];
      }
      this.processProducts();

    } catch (error) {
      console.error('Error loading initial dynamic products:', error);
      this.allProducts = [];
      this.initialDynamicProducts = [];
      this.processProducts();
    } finally {
      this.isLoading = false;
      this.stopLoadingMessagesRotation();
      this.cdr.detectChanges();
    }
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

  cargarProductosAdmin() {
    this.productoService.getAllProductsAdmin().subscribe({
      next: (productsadmin: ProductAdmin[]) => {
        this.productsadmin = productsadmin;
      },
      error: (error) => {
        console.error('Error al obtener los productsadmin:', error);
      }
    });
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

  onSearchChange(event: any) {
    const query = event.target.value ? event.target.value.toLowerCase().trim() : '';
    this.searchTerm = query;
    this.currentSearchCallId++;
    const localCallId = this.currentSearchCallId;

    if (!query && (!this.activeFilters || Object.keys(this.activeFilters).length === 0)) {
      this.isInitialView = true;
      this.allProducts = [...this.initialDynamicProducts];
      this.processProducts();
      this.isLoading = false;
      this.stopLoadingMessagesRotation();
      return;
    }

    this.isInitialView = false;


    if (!query && Object.keys(this.activeFilters).length > 0) {
      this.allProducts = [...this.initialDynamicProducts];
      this.processProducts();
      this.isLoading = false;
      this.stopLoadingMessagesRotation();
      return;
    }

    if (query) {
      const loadingTimer = setTimeout(() => {
        this.isLoading = true;
        this.startLoadingMessagesRotation();
        this.cdr.detectChanges();
      }, 250);

      this.http.get<SearchResponseWrapper>(`${this.searchApiUrl}/${query}`)
        .pipe(
          finalize(() => {
            if (localCallId === this.currentSearchCallId) {
              this.isLoading = false;
              this.stopLoadingMessagesRotation();
            }
          })
        )
        .subscribe({
          next: (response) => {
            clearTimeout(loadingTimer);

            if (localCallId === this.currentSearchCallId) {
              const productsFromServer = response.products || [];
              this.allProducts = productsFromServer.map((p: BackendProduct, index: number): Producto => this.mapBackendProductToProducto(p, index));
              this.processProducts();

              if (response.fromCache) {
                this.isLoading = false;
                this.stopLoadingMessagesRotation();
              }
            }
          },
          error: (err) => {
            clearTimeout(loadingTimer);

            if (localCallId === this.currentSearchCallId) {
              console.error(`Error al buscar productos para "${query}":`, err);
              this.allProducts = [];
              this.processProducts();
            }
          }
        });
    } else {
      this.isLoading = false;
      this.stopLoadingMessagesRotation();
      this.processProducts();
    }
  }

  onFiltersChanged(filters: ProductFilters) {
    this.activeFilters = filters;
    this.isInitialView = false;

    if (!this.searchTerm) {
      this.allProducts = [...this.initialDynamicProducts];
    }
    this.processProducts();
  }

  private processProducts() {
    let productsToDisplay = [...this.allProducts];


    //Precio entre
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
          productsToDisplay.sort((a, b) => {
            const ratingA = parseFloat(a.rating || '0') || 0;
            const ratingB = parseFloat(b.rating || '0') || 0;
            return ratingB - ratingA;
          });
          break;
      }
    }

    const grouped = new Map<string, Producto[]>();

    productsToDisplay.forEach(product => {
      const empresaKey = product.empresa || 'Desconocido';
      if (!grouped.has(empresaKey)) {
        grouped.set(empresaKey, []);
      }
      grouped.get(empresaKey)!.push(product);
    });

    this.groupedProducts = this.availableEmpresas
      .map(empresaName => ({
        empresa: empresaName,
        items: grouped.get(empresaName) || []
      }))
      .filter(group => group.items.length > 0);

    grouped.forEach((items, empresaName) => {
      if (!this.availableEmpresas.includes(empresaName)) {
        if (items.length > 0 && !this.groupedProducts.some(g => g.empresa === empresaName)) {
          this.groupedProducts.push({ empresa: empresaName, items });
        }
      }
    });

    this.cdr.detectChanges();
    this.updateSwipers();
  }

  hasProductsToDisplay(): boolean {
    return this.groupedProducts.some(group => group.items.length > 0);
  }

  toggleFavorito(producto: Producto | ProductAdmin): void {
    if (typeof producto.url !== 'string' || !producto.url || producto.url === '#') {
      console.error('CRITICAL: Product URL is invalid or not a string.', producto.url, producto);
      return;
    }
    const productUrlValue = producto.url;
    const originalFavoritoState = producto.favorito;
    producto.favorito = !producto.favorito;

    const requestUrl = this.favoriteApiBaseUrl;
    const params = new HttpParams().set('url', productUrlValue);

    let apiCall;
    if (producto.favorito) {
      apiCall = this.http.post(requestUrl, {}, { params: params });
    } else {
      apiCall = this.http.delete(requestUrl, { params: params });
    }

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
  }


  async mostrarToast(mensaje: string, color: 'success' | 'danger' | 'medium', duration: number = 4000) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: duration,
      color,
      position: 'top'
    });
    await toast.present();
  }

  async abrirCrearAlerta() {
    const popover = await this.popoverCtrl.create({
      component: CrearalertapopoverComponent,
      translucent: true,
      componentProps: {
        alerta: {
          concepto: this.searchTerm,
          precioObjetivo: undefined,
        }
      }
    });
    popover.onDidDismiss().then((result) => {
      if (result.data && result.data.submitted) {
        const alertaData = result.data.data as Partial<Alerta>;

        this.mostrarToast('Alerta creada', 'success', 3000);
        this.alertaService.crearAlerta(alertaData).subscribe({
          next: (response) => {
            console.log('Alerta creada:', response);
          },
          error: (err: any) => {
            console.error('Error al crear la alerta', err);
            const errorMessage = err.error?.message || 'Error desconocido al crear la alerta.';
            this.mostrarToast(`Error: ${errorMessage}`, 'danger', 5000);
          }
        });
      }
    });
    await popover.present();
  }


  async abrirNotificaciones() {
    const popover = await this.popoverCtrl.create({
      component: NotificacionespopoverComponent,
      translucent: true,
      componentProps: {
      }
    });
    await popover.present();
  }

  private mapBackendProductToProducto(p: BackendProduct, index: number): Producto {
    return {
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
      favorito: p.favorito || false,
      sourceQualityTag: p.sourceQualityTag
    };
  }

  onCategorySearch(category: string) {
    this.searchTerm = category;
    this.isInitialView = false;

    const searchbar = document.querySelector('ion-searchbar');
    if (searchbar) {
      (searchbar as any).value = category;
    }

    this.onSearchChange({ target: { value: category } });
  }
}
