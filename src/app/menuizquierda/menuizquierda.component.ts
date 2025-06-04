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
    'Electrónica', 'Moda', 'Hogar', 'Juguetes', 'Deportes', 'Belleza', 'Automóvil'
  ];

  sortBy: string | null = null;
  minPrice: number | null = null;
  maxPrice: number | null = null;
  selectedCategoriesMap: { [key: string]: boolean } = {};

  @Output() filtersApplied = new EventEmitter<ProductFilters>();
  @Output() filtersChanged = new EventEmitter<ProductFilters>();

  constructor() { }

  ngOnInit() {
    this.categorias.forEach(cat => this.selectedCategoriesMap[cat] = false);

    const modoGuardado = localStorage.getItem('modo');
    if (modoGuardado !== null) {
      this.modo = JSON.parse(modoGuardado);
    } else {
      this.modo = true;
    }
  }

  applyCurrentFilters() {
    const activeSelectedCategories = Object.keys(this.selectedCategoriesMap)
      .filter(cat => this.selectedCategoriesMap[cat]);

    const currentFilters: ProductFilters = {
      sortBy: this.sortBy || undefined,
      minPrice: this.minPrice !== null && !isNaN(Number(this.minPrice)) ? Number(this.minPrice) : undefined,
      maxPrice: this.maxPrice !== null && !isNaN(Number(this.maxPrice)) ? Number(this.maxPrice) : undefined,
      selectedCategories: activeSelectedCategories.length > 0 ? activeSelectedCategories : undefined
    };
    console.log('Applying filters:', currentFilters);
    this.filtersApplied.emit(currentFilters);
  }

  resetFilters() {
    this.sortBy = null;
    this.minPrice = null;
    this.maxPrice = null;
    this.categorias.forEach(cat => this.selectedCategoriesMap[cat] = false);
    this.filtersApplied.emit({});
    console.log('Filters reset');
  }
}
