import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { IonicModule } from "@ionic/angular";
import { FormsModule } from "@angular/forms";
import { NgForOf } from "@angular/common";
import { ProductFilters } from "../models/ProductFilters";

@Component({
  selector: 'app-menuizquierda',
  templateUrl: './menuizquierda.component.html',
  styleUrls: ['./menuizquierda.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    FormsModule,
    NgForOf
  ]
})
export class MenuizquierdaComponent implements OnInit {
  modo: boolean = true;
  categorias: string[] = [
    'Tarjetas Gráficas', 'Portatil', 'Videojuegos', 'Juguetes', 'Consolas', 'Móvil', 'Accesorios', 'Iluminación', 'Electrodomésticos'
  ];

  sortBy: string | null = null;
  minPrice: number | null = null;
  maxPrice: number | null = null;
  selectedCategory: string | null = null;

  @Output() filtersApplied = new EventEmitter<ProductFilters>();
  @Output() categorySelected = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
    const modoGuardado = localStorage.getItem('modo');
    if (modoGuardado !== null) {
      this.modo = JSON.parse(modoGuardado);
    } else {
      this.modo = true;
    }
  }

  applyCurrentFilters() {
    const currentFilters: ProductFilters = {
      sortBy: this.sortBy || undefined,
      minPrice: this.minPrice !== null && !isNaN(Number(this.minPrice)) ? Number(this.minPrice) : undefined,
      maxPrice: this.maxPrice !== null && !isNaN(Number(this.maxPrice)) ? Number(this.maxPrice) : undefined,
      selectedCategory: this.selectedCategory || undefined
    };

    this.filtersApplied.emit(currentFilters);

    if (this.selectedCategory) {
      this.categorySelected.emit(this.selectedCategory);
    }
    this.resetFilters();
  }

  resetFilters() {
    this.sortBy = null;
    this.minPrice = null;
    this.maxPrice = null;
    this.selectedCategory = null;
    console.log('Filters reset');
  }

  toggleCheckbox(categoria: string) {
    this.selectedCategory = this.selectedCategory === categoria ? null : categoria;
  }
}
