import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { MenuizquierdaconfigComponent } from '../menuizquierdaconfig/menuizquierdaconfig.component';
import { NgForOf, NgIf } from '@angular/common';
import { SwiperModule } from 'swiper/angular';
import { Producto } from '../models/Producto';
import SwiperCore, {Navigation, Pagination} from "swiper";
import {addIcons} from "ionicons";
import {heart, heartOutline, notificationsOutline, personCircleOutline} from "ionicons/icons";

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
    SwiperModule
  ]
})
export class OfertasguardadasComponent implements OnInit {
  modo: boolean = true;
  productos: Producto[] = [
    {
      id: 1,
      favorito: true,
      title: 'Auriculares Bluetooth',
      discount: '20%',
      actualPrice: 29.99,
      oldPrice: 39.99,
      image: 'https://m.media-amazon.com/images/I/61lX+a+vOFL.jpg',
      rating: '4.5',
      delivery: 'Entrega rápida',
      url: ''
    },
    {
      id: 2,
      favorito: true,
      title: 'Teclado Mecánico',
      discount: '15%',
      actualPrice: 59.99,
      oldPrice: 69.99,
      image: 'https://m.media-amazon.com/images/I/61Q56A7UfNL.jpg',
      rating: '4.8',
      delivery: 'Entrega en 24h',
      url: 'https://m.media-amazon.com/images/I/61Q56A7UfNL.jpg'
    },
    {
      id: 3,
      favorito: true,
      title: 'Smartwatch Deportivo',
      discount: '10%',
      actualPrice: 89.99,
      oldPrice: 99.99,
      image: 'https://www.mrcpower.es/834-large_default/smartwatch-sw-01.jpg',
      rating: '4.6',
      delivery: 'Entrega en 48h',
      url: 'https://example.com/smartwatch'
    }
    ,
    {
      id: 4,
      favorito: true,
      title: 'Smartwatch Deportivo',
      discount: '10%',
      actualPrice: 89.99,
      oldPrice: 99.99,
      image: 'https://www.mrcpower.es/834-large_default/smartwatch-sw-01.jpg',
      rating: '4.6',
      delivery: 'Entrega en 48h',
      url: 'https://example.com/smartwatch'
    },
    {
      id: 5,
      favorito: true,
      title: 'Teclado Mecánico',
      discount: '15%',
      actualPrice: 59.99,
      oldPrice: 69.99,
      image: 'https://m.media-amazon.com/images/I/61Q56A7UfNL.jpg',
      rating: '4.8',
      delivery: 'Entrega en 24h',
      url: 'https://m.media-amazon.com/images/I/61Q56A7UfNL.jpg'
    },
    {
      id: 6,
      favorito: true,
      title: 'Smartwatch Deportivo',
      discount: '10%',
      actualPrice: 89.99,
      oldPrice: 99.99,
      image: 'https://www.mrcpower.es/834-large_default/smartwatch-sw-01.jpg',
      rating: '4.6',
      delivery: 'Entrega en 48h',
      url: 'https://example.com/smartwatch'
    }
    ,
  ];


  constructor() {
    addIcons({
      'heart-outline': heartOutline,
      'heart': heart
    });
  }

  ngOnInit() {
    const modoGuardado = localStorage.getItem('modo');
    if (modoGuardado !== null) {
      this.modo = JSON.parse(modoGuardado);
    } else {
      this.modo = true;
    }
  }


  toggleFavorito(producto: any): void {
    producto.favorito = !producto.favorito;
  }
}
