import { Component, OnInit } from '@angular/core';
import { IonicModule, PopoverController } from "@ionic/angular";
import { CommonModule, NgFor, NgIf } from "@angular/common";
import { Perfil } from "../models/Perfil";
import { AuthService } from "../services/auth.service";
import { PerfilService } from "../services/perfil.service";
import { ProductoService } from "../services/producto.service";
import { ProductAdmin } from "../models/ProductAdmin";
import { SwiperModule } from "swiper/angular";
import SwiperCore, { Navigation, Pagination } from 'swiper';
import { CrearproductopopoverComponent } from "../crearproductopopover/crearproductopopover.component";
import { addIcons } from "ionicons";
import { personCircleOutline } from "ionicons/icons";
import { RouterLink } from "@angular/router";
import { FormsModule } from "@angular/forms";

SwiperCore.use([Navigation, Pagination]);

@Component({
  selector: 'app-paneladmin',
  templateUrl: './paneladmin.component.html',
  styleUrls: ['./paneladmin.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, NgFor, NgIf, SwiperModule, RouterLink]
})
export class PaneladminComponent implements OnInit {
  modo: boolean = true;

  miperfil: Perfil | null = null;
  perfilId: number | null = null;

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

  slidesPerView = 5; // Valor por defecto (pantallas grandes)
  swiperBreakpoints = {
    // Ajusta el número de slides según el ancho de la pantalla
    320: { slidesPerView: 1 },  // Móvil pequeño
    576: { slidesPerView: 2 },  // Móvil grande
    768: { slidesPerView: 3 },  // Tablet
    992: { slidesPerView: 4 },  // Pantalla mediana
    1200: { slidesPerView: 5 }  // Pantalla grande
  };


  productos: ProductAdmin[] = [];

  constructor(
    private authService: AuthService,
    private perfilService: PerfilService,
    private popoverCtrl: PopoverController,
    private productoService: ProductoService,
  ) {
    addIcons({
      'person-circle-outline': personCircleOutline,
    });
  }

  ngOnInit() {
    this.cargarProductos();
    this.perfilId = this.authService.getPerfilIdFromToken();

    if (this.perfilId !== null) {
      this.perfilService.getPerfilById(this.perfilId).subscribe({
        next: (data: Perfil) => {
          console.log('📦 Perfil recibido del backend:', data);
          if (!data) {
            console.warn('⚠️ No se recibió ningún perfil');
          }
        },
        error: (error) => {
          console.error('Error al obtener el perfil:', error);
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

  cargarProductos() {
    this.productoService.getAllProductsAdmin().subscribe({
      next: (productos: ProductAdmin[]) => {
        console.log('📦 Productos recibidos del backend:', productos);
        this.productos = productos;
      },
      error: (error) => {
        console.error('Error al obtener los productos:', error);
      }
    });
  }

  deleteProduct(product: ProductAdmin) {
    this.productoService.deleteProduct(product.url).subscribe({
      next: () => {
        console.log('✅ Producto eliminado correctamente:', product);
        this.cargarProductos();
      },
      error: (error) => {
        console.error('Error al eliminar el producto:', error);
      }
    });
  }

  abrirCrearProducto(productadmin?: ProductAdmin) {
    this.popoverCtrl.create({
      component: CrearproductopopoverComponent,
      componentProps: { productadmin }
    }).then(popover => {
      popover.present();
      popover.onDidDismiss().then(({ data }) => {
        if (data === 'editado' || data === 'creado') {
          this.cargarProductos();
        }
      });
    });
  }
}
