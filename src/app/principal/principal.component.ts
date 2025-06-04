import {Component, OnInit} from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import {IonicModule, PopoverController} from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Producto } from '../models/Producto';
import {addIcons} from "ionicons";
import {heart, heartOutline, notificationsOutline, personCircleOutline} from "ionicons/icons";
import {MenuizquierdaComponent} from "../menuizquierda/menuizquierda.component";
import { SwiperModule } from 'swiper/angular';
import SwiperCore, { Navigation, Pagination } from 'swiper';
import {RouterLink} from "@angular/router";
import {CrearalertapopoverComponent} from "../crearalertapopover/crearalertapopover.component";
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
  favorito: boolean = false;
  modo: boolean = true;

  productos: Producto[] = [
    {
      id: 1,
      favorito: false,
      title: 'Auriculares Bluetooth',
      discount: '20%',
      actualPrice: 29.99,
      oldPrice: 39.99,
      image: 'https://canarias.worten.es/i/ff5b01f16dddc7df279533f12f08f5e2f96fb153',
      rating: '4.5',
      delivery: 'Entrega rápida o lo antes posible no se lo que me salga de los co',
      url: 'https://amzn.eu/d/19sWE1t'
    },
    {
      id: 2,
      favorito: false,
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
      favorito: false,
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
      favorito: false,
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
      favorito: false,
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
      favorito: false,
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
      favorito: false,
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
      favorito: false,
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
  constructor(
    private popoverCtrl: PopoverController,
  ) {
    addIcons({
      'person-circle-outline': personCircleOutline,
      'notifications-outline': notificationsOutline,
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

  async abrirCrearAlerta() {
    const popover = await this.popoverCtrl.create({
      component: CrearalertapopoverComponent,
      translucent: true,
      componentProps: {
        alerta: null // O un objeto vacío para crear nuevo
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
