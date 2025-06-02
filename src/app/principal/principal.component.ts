import {Component, OnInit} from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Producto } from '../models/Producto';
import {addIcons} from "ionicons";
import {notificationsOutline, personCircleOutline} from "ionicons/icons";
import {MenuizquierdaComponent} from "../menuizquierda/menuizquierda.component";
import { SwiperModule } from 'swiper/angular';
import SwiperCore, { Navigation, Pagination } from 'swiper';
import {RouterLink} from "@angular/router";
SwiperCore.use([Navigation, Pagination]);

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, NgFor, NgIf, MenuizquierdaComponent, SwiperModule, RouterLink],
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss']
})
export class PrincipalComponent implements OnInit{
  empresas: string[] = ['Amazon', 'eBay', 'AliExpress', 'PCComponentes', 'MediaMarkt', 'Carrefour', 'El Corte Inglés'];


  productos: Producto[] = [
    {
      id: 1,
      title: 'Auriculares Bluetooth',
      discount: '20%',
      actualPrice: 29.99,
      oldPrice: 39.99,
      image: 'https://canarias.worten.es/i/ff5b01f16dddc7df279533f12f08f5e2f96fb153',
      rating: '4.5',
      delivery: 'Entrega rápida',
      url: 'https://amzn.eu/d/19sWE1t'
    },
    {
      id: 2,
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
      id: 4,
      title: 'Cámara Deportiva 4K',
      discount: '25%',
      actualPrice: 74.99,
      oldPrice: 99.99,
      image: 'https://correos-marketplace.ams3.cdn.digitaloceanspaces.com/prod-new/uploads/correos-marketplace-shop/1/product/108041-31wkrigo-klack-camara-deportiva-de-accion-klack-full-hd-1080p-resistente-al-agua-negro-1.jpg',
      rating: '4.7',
      delivery: 'Entrega en 24h',
      url: 'https://example.com/camara-deportiva'
    },
    {
      id: 5,
      title: 'Altavoz Bluetooth Portátil',
      discount: '30%',
      actualPrice: 34.99,
      oldPrice: 49.99,
      image: 'https://vieta.es/cdn/shop/files/8431543119867_01_030853ba-ca86-469b-8085-e29b77c7b141.jpg?v=1743670682',
      rating: '4.4',
      delivery: 'Entrega rápida',
      url: 'https://example.com/altavoz-bluetooth'
    },
    {
      id: 6,
      title: 'Monitor Full HD 24"',
      discount: '20%',
      actualPrice: 119.99,
      oldPrice: 149.99,
      image: 'https://m.media-amazon.com/images/I/81QpkIctqPL._AC_SL1500_.jpg',
      rating: '4.6',
      delivery: 'Entrega en 48h',
      url: 'https://example.com/monitor-fullhd'
    },
    {
      id: 7,
      title: 'Monitor Full HD 24"',
      discount: '20%',
      actualPrice: 119.99,
      oldPrice: 149.99,
      image: 'https://m.media-amazon.com/images/I/81QpkIctqPL._AC_SL1500_.jpg',
      rating: '4.6',
      delivery: 'Entrega en 48h',
      url: 'https://example.com/monitor-fullhd'
    },
    {
      id: 8,
      title: 'Monitor Full HD 24"',
      discount: '20%',
      actualPrice: 119.99,
      oldPrice: 149.99,
      image: 'https://m.media-amazon.com/images/I/81QpkIctqPL._AC_SL1500_.jpg',
      rating: '4.6',
      delivery: 'Entrega en 48h',
      url: 'https://example.com/monitor-fullhd'
    }
  ];
  constructor() {
    addIcons({
      'person-circle-outline': personCircleOutline,
      'notifications-outline': notificationsOutline
    });
  }
  ngOnInit() {
  }
}
