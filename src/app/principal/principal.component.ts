import { Component } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Producto } from '../models/Producto';
import {addIcons} from "ionicons";
import {notificationsOutline, personCircleOutline} from "ionicons/icons";
import {MenuizquierdaComponent} from "../menuizquierda/menuizquierda.component";

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, NgFor, NgIf, MenuizquierdaComponent], // 👈 agrégalos aquí
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss']
})
export class PrincipalComponent {
  empresas: string[] = ['Amazon', 'eBay', 'AliExpress', 'PCComponentes', 'MediaMarkt', 'Carrefour', 'El Corte Inglés'];

  productos: Producto[] = [
    {
      id: 1,
      title: 'Auriculares Bluetooth',
      discount: '20%',
      actualPrice: 29.99,
      oldPrice: 39.99,
      image: 'https://www.energysistem.com/cdnassets/products/45839/serie_2000.webp?2/d/8/1/2d818c47d79454c36d45c0f6cdb63cd0311b1729_Silent_ANC__45839_B2B_principal.jpg',
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
  ];
  constructor() {
    addIcons({
      'person-circle-outline': personCircleOutline,
      'notifications-outline': notificationsOutline
    });
  }
}
