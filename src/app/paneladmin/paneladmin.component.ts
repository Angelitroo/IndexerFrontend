import { Component, OnInit } from '@angular/core';
import { IonicModule, PopoverController } from "@ionic/angular";
import { CommonModule, NgFor, NgIf } from "@angular/common";
import { Perfil } from "../models/Perfil";
import { PerfilFull } from "../models/PerfilFull";
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

  perfiles: PerfilFull[] = [  ];

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
    this.cargarPerfiles();
    this.perfilId = this.authService.getPerfilIdFromToken();

    if (this.perfilId !== null) {
      this.perfilService.getPerfilById(this.perfilId).subscribe({
        next: (data: Perfil) => {
          this.miperfil = data;
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

  cargarPerfiles() {
    this.perfilService.getPerfiles().subscribe({
      next: (perfiles: PerfilFull[]) => {
        console.log('📦 Perfiles recibidos del backend:', perfiles);
        this.perfiles = perfiles.filter(perfil => perfil.rol !== 'ADMIN');
      },
      error: (error) => {
        console.error('Error al obtener los perfiles:', error);
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
