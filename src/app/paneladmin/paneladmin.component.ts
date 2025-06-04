import { Component, OnInit } from '@angular/core';
import {IonicModule, PopoverController} from "@ionic/angular";
import {CommonModule, NgFor, NgIf} from "@angular/common";
import {Perfil} from "../models/Perfil";
import {AuthService} from "../services/auth.service";
import {PerfilService} from "../services/perfil.service";
import {Producto} from "../models/Producto";
import {SwiperModule} from "swiper/angular";
import SwiperCore, { Navigation, Pagination } from 'swiper';
import {CrearproductopopoverComponent} from "../crearproductopopover/crearproductopopover.component";
import {addIcons} from "ionicons";
import {personCircleOutline} from "ionicons/icons";
import {RouterLink} from "@angular/router";
import {FormsModule} from "@angular/forms";

SwiperCore.use([Navigation, Pagination]);
@Component({
    selector: 'app-paneladmin',
    templateUrl: './paneladmin.component.html',
    styleUrls: ['./paneladmin.component.scss'],
    standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, NgFor, NgIf, SwiperModule, RouterLink]
})

export class PaneladminComponent  implements OnInit {
  modo: boolean = true;
  miperfil: Perfil | null = null;

  perfilId: number | null = null;
  perfil: Perfil | null = null;
  perfiles: Perfil[] = [
    {
      id: 1,
      nombre: 'Juan',
      apellido: 'Pérez',
      ubicacion: 'Madrid, España',
      imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbGgko7AggykEsN6k1_Ddj4_U_PPzeIeENUA&s',
      baneado: false,
      perfil: 1,
    },
    {
      id: 2,
      nombre: 'María',
      apellido: 'Gómez',
      ubicacion: 'Barcelona, España',
      imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6BkDNK7JcwMkGJWKpV3lR4Wqp_UOuj-IEHw&s',
      baneado: true,
      perfil: 2,
    },
    {
      id: 3,
      nombre: 'Carlos',
      apellido: 'López',
      ubicacion: 'Valencia, España',
      imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfNdlbCFhb0ctP_AWbNurXGhv55OGg2k0rcg&s',
      baneado: false,
      perfil: 3,
    },
    {
      id: 4,
      nombre: 'Ana',
      apellido: 'Martínez',
      ubicacion: 'Sevilla, España',
      imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQB2Mvs7EKFjH0K0g8Pm6nJ-Qi1PJnsTSdyww&s',
      baneado: false,
      perfil: 4,
    },
    {
      id: 5,
      nombre: 'Gonzalo',
      apellido: 'Gomez Monasterio',
      ubicacion: 'Panchitolandia, Venezuela',
      imagen: 'https://i.imgflip.com/4151ec.jpg?a485064',
      baneado: true,
      perfil: 5,
    },
    {
      id: 6,
      nombre: 'Sofía',
      apellido: 'Ramírez',
      ubicacion: 'Granada, España',
      imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6sPxq4Um5j7M2ATQhcU3RqSFjQWbp9aLDew&s',
      baneado: false,
      perfil: 6,
    },
    {
      id: 7,
      nombre: 'Diego',
      apellido: 'Fernández',
      ubicacion: 'Zaragoza, España',
      imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQA3u8HgIoupxD26I7FCGvwTTh9nhd5ViqFaQ&s',
      baneado: false,
      perfil: 7,
    },
    {
      id: 8,
      nombre: 'Lucía',
      apellido: 'García',
      ubicacion: 'Málaga, España',
      imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuw4XWNiOLg6qbNBIlqUuQPJrDRse9Kt8cxA&s',
      baneado: true,
      perfil: 8,
    },
    {
      id: 9,
      nombre: 'Javier',
      apellido: 'Sánchez',
      ubicacion: 'Alicante, España',
      imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgrgziWJTmWQijYB_Egtf3aFP9TY4Ac3fL2A&s',
      baneado: false,
      perfil: 9,
    },
    {
      id: 10,
      nombre: 'Elena',
      apellido: 'Torres',
      ubicacion: 'Córdoba, España',
      imagen: 'https://i.redd.it/n3tcn9mdij151.jpg',
      baneado: false,
      perfil: 10,
    },
  ];


  productos: Producto[] = [
    {
      id: 1,
      favorito: false,
      title: 'Auriculares Bluetooth',
      discount: '20%',
      actualPrice: 29.99,
      oldPrice: 39.99,
      image: 'https://m.media-amazon.com/images/I/61lX+a+vOFL.jpg',
      rating: '4.5',
      delivery: 'Entrega rápida',
      url: '',
      empresa: ''
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
      url: 'https://m.media-amazon.com/images/I/61Q56A7UfNL.jpg',
      empresa: ''
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
      url: 'https://example.com/smartwatch',
      empresa: ''
    }
    ,
    {
      id: 4,
      favorito: false,
      title: 'Smartwatch Deportivo',
      discount: '10%',
      actualPrice: 89.99,
      oldPrice: 99.99,
      image: 'https://www.mrcpower.es/834-large_default/smartwatch-sw-01.jpg',
      rating: '4.6',
      delivery: 'Entrega en 48h',
      url: 'https://example.com/smartwatch',
      empresa: ''
    }
    ,
    {
      id: 5,
      favorito: false,
      title: 'Smartwatch Deportivo',
      discount: '10%',
      actualPrice: 89.99,
      oldPrice: 99.99,
      image: 'https://www.mrcpower.es/834-large_default/smartwatch-sw-01.jpg',
      rating: '4.6',
      delivery: 'Entrega en 48h',
      url: 'https://example.com/smartwatch',
      empresa: ''
    },
    {
      id: 6,
      favorito: false,
      title: 'Smartwatch Deportivo',
      discount: '10%',
      actualPrice: 89.99,
      oldPrice: 99.99,
      image: 'https://www.mrcpower.es/834-large_default/smartwatch-sw-01.jpg',
      rating: '4.6',
      delivery: 'Entrega en 48h',
      url: 'https://example.com/smartwatch',
      empresa: ''
    }
  ];



  constructor(
    private authService: AuthService,
    private perfilService: PerfilService,
    private popoverCtrl: PopoverController

  ) {addIcons({
    'person-circle-outline': personCircleOutline,
  });  }

  ngOnInit() {
    this.perfilId = this.authService.getPerfilIdFromToken();

    if (this.perfilId !== null) {
      this.perfilService.getPerfilById(this.perfilId).subscribe({
        next: (data: Perfil) => {
          console.log('📦 Perfil recibido del backend:', data);
          if (!data) {
            console.warn('⚠️ No se recibió ningún perfil');
          }
          this.miperfil = data;
          console.log('✅ miperfil asignado:', this.miperfil);
        },
        error: (error) => {
          console.error('❌ Error al obtener el perfil:', error);
        }
      });
    } else {
      console.warn('⚠️ No se pudo obtener el ID del perfil desde el token.');
    }

    const modoGuardado = localStorage.getItem('modo');
    if (modoGuardado !== null) {
      this.modo = JSON.parse(modoGuardado);
    } else {
      this.modo = true;
    }
  }




  async abrirCrearProducto() {
    const popover = await this.popoverCtrl.create({
      component: CrearproductopopoverComponent,
      translucent: true,
      componentProps: {
        producto: null // O un objeto vacío para crear nuevo
      }
    });

    popover.onDidDismiss().then((result) => {
      if (result.data) {
        console.log('Producto creado/modificado:', result.data);
      }
    });

    await popover.present();
  }

}
