import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { MenuizquierdaconfigComponent } from '../menuizquierdaconfig/menuizquierdaconfig.component';
import { NgForOf, NgIf } from '@angular/common';
import { SwiperModule } from 'swiper/angular';
import { Producto } from '../models/Producto';

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
  productos: Producto[] = [
    {
      id: 1,
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
      image: 'https://correos-marketplace.ams3.cdn.digitaloceanspaces.com/prod-new/uploads/correos-marketplace-shop/1/product/99478-keuadwa8-klack-smartwatch-reloj-inteligente-t500p-deportivo-fitness-hombre-mujer-klack-blanco-1.jpg',
      rating: '4.6',
      delivery: 'Entrega en 48h',
      url: 'https://example.com/smartwatch'
    }
    ,
    {
      id: 4,
      title: 'Smartwatch Deportivo',
      discount: '10%',
      actualPrice: 89.99,
      oldPrice: 99.99,
      image: 'https://correos-marketplace.ams3.cdn.digitaloceanspaces.com/prod-new/uploads/correos-marketplace-shop/1/product/99478-keuadwa8-klack-smartwatch-reloj-inteligente-t500p-deportivo-fitness-hombre-mujer-klack-blanco-1.jpg',
      rating: '4.6',
      delivery: 'Entrega en 48h',
      url: 'https://example.com/smartwatch'
    },
    {
      id: 5,
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
      title: 'Smartwatch Deportivo',
      discount: '10%',
      actualPrice: 89.99,
      oldPrice: 99.99,
      image: 'https://correos-marketplace.ams3.cdn.digitaloceanspaces.com/prod-new/uploads/correos-marketplace-shop/1/product/99478-keuadwa8-klack-smartwatch-reloj-inteligente-t500p-deportivo-fitness-hombre-mujer-klack-blanco-1.jpg',
      rating: '4.6',
      delivery: 'Entrega en 48h',
      url: 'https://example.com/smartwatch'
    }
    ,
  ];


  constructor() { }

  ngOnInit() {}

}
