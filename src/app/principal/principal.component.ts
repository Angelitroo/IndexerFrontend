import { Component, OnInit, AfterViewInit, ElementRef, QueryList, ViewChildren, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterLink } from "@angular/router";

import { SwiperModule, SwiperComponent } from 'swiper/angular'; // Import SwiperComponent
import SwiperCore, { Navigation, Pagination, SwiperOptions, Autoplay } from 'swiper'; // Added Autoplay as an example, add others if you use them

import { addIcons } from "ionicons";
import { notificationsOutline, personCircleOutline } from "ionicons/icons";
import { finalize } from 'rxjs/operators';

import { MenuizquierdaComponent } from "../menuizquierda/menuizquierda.component";
import { Producto } from '../models/Producto';
import { ProductFilters } from '../models/ProductFilters';

// Install Swiper modules
SwiperCore.use([Navigation, Pagination, Autoplay]); // Add Autoplay or other modules you use

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

  private currentSearchCallId = 0;
  private apiUrl = 'http://localhost:8080/scrap/search';

  @ViewChildren('scrollArea') scrollAreas!: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren(SwiperComponent) swiperInstances!: QueryList<SwiperComponent>;

  // Centralized Swiper configuration
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
    observer: true, // Key for dynamic content: Reinitializes Swiper when Swiper's wrapper or slides change
    observeParents: true, // Reinitializes Swiper when Swiper's parent elements change
    observeSlideChildren: true, // Reinitializes Swiper when Swiper's children slides change
  };

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {
    addIcons({
      'person-circle-outline': personCircleOutline,
      'notifications-outline': notificationsOutline
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
    console.log("Initial Empresas (ordered):", JSON.parse(JSON.stringify(this.initialEmpresas)));
    this.processProducts(); // This will also call updateSwipers internally
    console.log("--- ngOnInit END ---");
  }

  ngAfterViewInit() {
    console.log("--- ngAfterViewInit START ---");
    this.attachWheelListeners(this.scrollAreas);

    // Initial update for swipers that might be present from the start
    this.updateSwipers();

    // Subscribe to changes in the QueryList of swipers
    // This handles cases where swipers are added/removed by *ngIf
    this.swiperInstances.changes.subscribe(() => {
      console.log("Swiper instances QueryList changed. Updating swipers.");
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
      { id: 1, title: 'Auriculares Bluetooth', discount: '20%', actualPrice: 29.99, oldPrice: 39.99, image: 'https://www.energysistem.com/cdnassets/products/45839/serie_2000.webp?2/d/8/1/2d818c47d79454c36d45c0f6cdb63cd0311b1729_Silent_ANC__45839_B2B_principal.jpg', rating: '4.5', delivery: 'Entrega rápida', url: 'https://example.com/auriculares', empresa: 'Amazon' },
      { id: 2, title: 'Teclado Mecánico', discount: '15%', actualPrice: 59.99, oldPrice: 69.99, image: 'https://m.media-amazon.com/images/I/61Q56A7UfNL.jpg', rating: '4.8', delivery: 'Entrega en 24h', url: 'https://example.com/teclado', empresa: 'PCComponentes' },
      { id: 3, title: 'Smartwatch Deportivo', discount: '10%', actualPrice: 89.99, oldPrice: 99.99, image: 'https://correos-marketplace.ams3.cdn.digitaloceanspaces.com/prod-new/uploads/correos-marketplace-shop/1/product/99478-keuadwa8-klack-smartwatch-reloj-inteligente-t500p-deportivo-fitness-hombre-mujer-klack-blanco-1.jpg', rating: '4.6', delivery: 'Entrega en 48h', url: 'https://example.com/smartwatch', empresa: 'AliExpress' },
      { id: 4, title: 'Cámara Deportiva 4K', discount: '25%', actualPrice: 74.99, oldPrice: 99.99, image: 'https://correos-marketplace.ams3.cdn.digitaloceanspaces.com/prod-new/uploads/correos-marketplace-shop/1/product/108041-31wkrigo-klack-camara-deportiva-de-accion-klack-full-hd-1080p-resistente-al-agua-negro-1.jpg', rating: '4.7', delivery: 'Entrega en 24h', url: 'https://example.com/camara-deportiva', empresa: 'MediaMarkt' },
      { id: 5, title: 'Altavoz Bluetooth Portátil', discount: '30%', actualPrice: 34.99, oldPrice: 49.99, image: 'https://vieta.es/cdn/shop/files/8431543119867_01_030853ba-ca86-469b-8085-e29b77c7b141.jpg?v=1743670682', rating: '4.4', delivery: 'Entrega rápida', url: 'https://example.com/altavoz-bluetooth', empresa: 'eBay' },
      { id: 6, title: 'Monitor Full HD 24"', discount: '20%', actualPrice: 119.99, oldPrice: 149.99, image: 'https://m.media-amazon.com/images/I/81QpkIctqPL._AC_SL1500_.jpg', rating: '4.6', delivery: 'Entrega en 48h', url: 'https://example.com/monitor-fullhd', empresa: 'Carrefour' },
      { id: 7, title: 'Otro Monitor Full HD 24"', discount: '20%', actualPrice: 119.99, oldPrice: 149.99, image: 'https://m.media-amazon.com/images/I/81QpkIctqPL._AC_SL1500_.jpg', rating: '4.6', delivery: 'Entrega en 48h', url: 'https://example.com/monitor-fullhd-otro', empresa: 'El Corte Inglés' },
      { id: 8, title: 'Super Auriculares Pro', discount: '10%', actualPrice: 179.99, oldPrice: 199.99, image: 'https://www.energysistem.com/cdnassets/products/45839/serie_2000.webp?2/d/8/1/2d818c47d79454c36d45c0f6cdb63cd0311b1729_Silent_ANC__45839_B2B_principal.jpg', rating: '4.9', delivery: 'Entrega Prioritaria', url: 'https://example.com/super-auriculares', empresa: 'Amazon' },
      { id: 9, title: 'Ratón Gaming Ergonómico', discount: '22%', actualPrice: 45.00, oldPrice: 58.00, image: 'https://m.media-amazon.com/images/I/61mKmNUYvrL._AC_SL1500_.jpg', rating: '4.7', delivery: 'Entrega en 24h', url: 'https://example.com/raton-gaming', empresa: 'PCComponentes' },
      { id: 10, title: 'Tablet Económica 10"', discount: '5%', actualPrice: 120.50, oldPrice: 126.80, image: 'https://m.media-amazon.com/images/I/616rN2N2WbL._AC_SL1000_.jpg', rating: '4.2', delivery: 'Entrega en 72h', url: 'https://example.com/tablet-eco', empresa: 'AliExpress' }
    ];
    console.log("Products defined in initializeHardcodedData:", this.initialHardcodedProductos.length);
    console.log("--- initializeHardcodedData END ---");
  }

  private updateSwipers() {
    // It's good practice to ensure Angular has processed changes before manual DOM libs update
    this.cdr.detectChanges();

    // Use a slightly longer timeout or requestAnimationFrame for potentially better timing
    // setTimeout is generally fine; 50-100ms is common.
    // requestAnimationFrame ties the update to the browser's repaint cycle.
    requestAnimationFrame(() => {
      if (this.swiperInstances && this.swiperInstances.length > 0) {
        console.log(`Found ${this.swiperInstances.length} swiper instances. Updating...`);
        this.swiperInstances.forEach((swiperInstance: SwiperComponent, index: number) => {
          if (swiperInstance && swiperInstance.swiperRef) {
            const swiper = swiperInstance.swiperRef;
            console.log(`Updating swiper instance #${index}. Current state - Slides: ${swiper.slides?.length}, slidesPerView: ${swiper.params?.slidesPerView}, isLocked: ${swiper.isLocked}, isBeginning: ${swiper.isBeginning}, isEnd: ${swiper.isEnd}`);

            swiper.update(); // Recalculates size, slides, positions etc.
            if (swiper.navigation) {
              swiper.navigation.update(); // Specifically updates navigation buttons states
            }
            if (swiper.pagination) {
              swiper.pagination.update(); // Updates pagination if used
            }
            console.log(`After update for swiper #${index} - isLocked: ${swiper.isLocked}, isBeginning: ${swiper.isBeginning}, isEnd: ${swiper.isEnd}`);
          } else {
            console.warn(`Swiper instance #${index} or its swiperRef not found.`);
          }
        });
        // Potentially run change detection again if Swiper's updates could affect Angular bindings,
        // though often not necessary if Swiper is managing its own DOM parts.
        // this.cdr.detectChanges();
      } else {
        console.log("No swiper instances found by ViewChildren to update.");
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

    if (!query && (!this.activeFilters || Object.keys(this.activeFilters).length === 0 || (Object.keys(this.activeFilters).length === 1 && this.activeFilters.selectedEmpresas?.length ===0))) {
      this.isInitialView = true;
      this.allProducts = [...this.initialHardcodedProductos];
      this.processProducts();
      this.isLoading = false;
      return;
    }

    this.isInitialView = false;
    this.isLoading = true;

    if (!query && Object.keys(this.activeFilters).length > 0) {
      this.allProducts = [...this.initialHardcodedProductos];
      this.processProducts();
      this.isLoading = false;
      return;
    }

    if(query){
      this.http.get<BackendProduct[]>(`${this.apiUrl}/${query}`)
        .pipe(
          finalize(() => {
            if (localCallId === this.currentSearchCallId) { this.isLoading = false; }
          })
        )
        .subscribe({
          next: (data) => {
            if (localCallId === this.currentSearchCallId) {
              this.allProducts = data.map((p: BackendProduct, index: number): Producto => <Producto>({
                id: p.id || (Date.now() + index),
                title: p.title || 'Producto sin título',
                discount: p.discount || '',
                actualPrice: p.actualPrice || 0,
                oldPrice: p.oldPrice,
                image: p.image || 'assets/images/placeholder.png',
                rating: p.rating || undefined,
                delivery: p.delivery || undefined,
                url: p.url || p.urlProduct || '#',
                empresa: p.empresa || p.source || 'Desconocido'
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
      this.isLoading = false; // Should be covered, but as a fallback
      this.processProducts(); // Process even if query is empty but filters might be active
    }
  }

  onFiltersChanged(filters: ProductFilters) {
    this.activeFilters = filters;
    this.isInitialView = false;

    if (!this.searchTerm) {
      this.allProducts = [...this.initialHardcodedProductos];
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
    console.log("Grouped products (after processing):", JSON.parse(JSON.stringify(this.groupedProducts)));
    console.log("--- processProducts END --- Calling updateSwipers ---");

    // Call detectChanges *before* updateSwipers to ensure Angular has rendered the slides
    this.cdr.detectChanges();
    this.updateSwipers(); // This will now use requestAnimationFrame or your chosen timeout
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
}
