import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {MenuizquierdaconfigComponent} from "../menuizquierdaconfig/menuizquierdaconfig.component";
import {NgForOf, NgIf} from "@angular/common";
import {Busqueda} from "../models/Busqueda";
import { SwiperModule } from 'swiper/angular';
import SwiperCore, { Navigation, Pagination } from 'swiper';
SwiperCore.use([Navigation, Pagination]);
@Component({
    selector: 'app-historial',
    templateUrl: './historial.component.html',
    styleUrls: ['./historial.component.scss'],
    standalone: true,
  imports: [
    IonicModule,
    MenuizquierdaconfigComponent,
    NgForOf,
    SwiperModule,
  ]
})
export class HistorialComponent  implements OnInit {
  modo: boolean = true;
 historial : Busqueda[] = [
    {
      id: 1,
      fecha: '2023-10-01 A las 18:34',
      concepto: 'Como coger un bebe sin que se te caiga al suelo'
    },
    {
      id: 2,
      fecha: '2023-10-01 A las 18:34',
      concepto: 'Que hacer si se te cae un bebe al suelo'
    },
    {
      id: 3,
      fecha: '2023-10-01 A las 18:35',
      concepto: 'Precio de medicos pediatras en Madrid'
    },
    {
      id: 4,
      fecha: '2023-10-01 A las 18:35',
      concepto: 'Precio de bolsas de basura en Madrid'
    },
    {
      id: 5,
      fecha: '2023-10-01 A las 18:36',
      concepto: 'Donde esconder un cadaver en Madrid sin que te pillen'
    },
    {
      id: 6,
      fecha: '2023-10-01 A las 18:36',
      concepto: 'Como hacer un disfraz de Halloween con bolsas de basura'
    },
    {
      id: 7,
      fecha: '2023-10-01 A las 18:37',
      concepto: 'Como hacer una broma pesada a tu vecino'
    },
    {
      id: 8,
      fecha: '2023-10-01 A las 18:37',
      concepto: 'Como hacer un disfraz de Halloween con bolsas de basura'
    },
    {
      id: 9,
      fecha: '2023-10-01 A las 18:38',
      concepto: 'Como hacer un disfraz de Halloween con bolsas de basura'
    },
    {
      id: 10,
      fecha: '2023-10-01 A las 18:38',
      concepto: 'Como hacer un disfraz de Halloween con bolsas de basura'
    },
    {
      id: 11,
      fecha: '2023-10-01 A las 18:39',
      concepto: 'Como hacer un disfraz de Halloween con bolsas de basura'
    },
    {
      id: 12,
      fecha: '2023-10-01 A las 18:39',
      concepto: 'Como hacer un disfraz de Halloween con bolsas de basura'
    },
    {
      id: 13,
      fecha: '2023-10-01 A las 18:40',
      concepto: 'Como hacer un disfraz de Halloween con bolsas de basura'
    },
    {
      id: 14,
      fecha: '2023-10-01 A las 18:40',
      concepto: 'Como hacer un disfraz de Halloween con bolsas de basura'
    },
    {
      id: 15,
      fecha: '2023-10-01 A las 18:41',
      concepto: 'Como hacer un disfraz de Halloween con bolsas de basura'
    }
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
