import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";

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
export class MenuizquierdaComponent  implements OnInit {
  modo: boolean = true;
  categorias: string[] = [
    'Electrónica',
    'Moda',
    'Hogar',
    'Juguetes',
    'Deportes',
    'Belleza',
    'Automóvil'
  ];


  constructor() { }

  ngOnInit() {
    const modoGuardado = localStorage.getItem('modo');
    if (modoGuardado !== null) {
      this.modo = JSON.parse(modoGuardado);
    } else {
      this.modo = true;
    }
  }

}
