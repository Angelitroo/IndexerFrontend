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
import { ToastController } from "@ionic/angular";
import {AdminperfilpopoverComponent} from "../adminperfilpopover/adminperfilpopover.component";
import {PerfilActualizar} from "../models/PerfilActualizar";

SwiperCore.use([Navigation, Pagination]);

@Component({
  selector: 'app-paneladmin',
  templateUrl: './paneladmin.component.html',
  styleUrls: ['./paneladmin.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, NgFor, NgIf, SwiperModule, RouterLink]
})
export class PaneladminComponent implements OnInit {
  private searchTimeout: any;
  modo: boolean = true;

  miperfil: Perfil | null = null;
  perfilId: number | null = null;

  perfiles: PerfilFull[] = [  ];

  slidesPerView = 5;
  swiperBreakpoints = {
    320: { slidesPerView: 1 },
    576: { slidesPerView: 2 },
    768: { slidesPerView: 3 },
    992: { slidesPerView: 4 },
    1200: { slidesPerView: 5 }
  };

  productos: ProductAdmin[] = [];

  constructor(
    private authService: AuthService,
    private perfilService: PerfilService,
    private popoverCtrl: PopoverController,
    private productoService: ProductoService,
    private toastController: ToastController
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

  async mostrarToast(mensaje: string, color: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      color,
      position: 'top'
    });
    await toast.present();
  }

  buscarPerfiles(event: any) {
    clearTimeout(this.searchTimeout);
    const nombre = event.target.value.trim();

    this.searchTimeout = setTimeout(() => {
      if (nombre.length > 0) {
        this.perfilService.buscarPorNombre(nombre).subscribe({
          next: (perfiles: PerfilFull[]) => {
            this.perfiles = perfiles.filter(perfil => perfil.rol !== 'ADMIN');
          },
          error: (error) => {
            console.error('Error al buscar perfiles:', error);
            this.mostrarToast('Error al buscar perfiles', 'danger');
          }
        });
      } else {
        this.cargarPerfiles();
      }
    }, 150);
  }
  ngOnDestroy() {
    clearTimeout(this.searchTimeout);
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
        this.mostrarToast('Producto eliminado correctamente', 'success');
        this.cargarProductos();
      },
      error: (error) => {
        console.error('Error al eliminar el producto:', error);
        this.mostrarToast('Error al eliminar el producto', 'danger');
      }
    });
  }

  eliminarPerfil(perfil: PerfilFull) {
    this.perfilService.eliminarPerfil(perfil.id).subscribe({
      next: (respuesta: string) => {
        console.log('✅ Perfil eliminado correctamente:', respuesta);
        this.mostrarToast('Perfil eliminado correctamente', 'success');
        this.cargarPerfiles();
      },
      error: (error) => {
        console.error('Error al eliminar el perfil:', error);
        this.mostrarToast('Error al eliminar el perfil', 'danger');
      }
    });
  }

  async abrirCrearProducto(productadmin?: ProductAdmin) {
    const popover = await this.popoverCtrl.create({
      component: CrearproductopopoverComponent,
      componentProps: {
        productadminInput: productadmin
      }
    });

    await popover.present();

    const { data } = await popover.onDidDismiss();
    if (data && (data === 'editado' || data === 'creado')) {
      this.cargarProductos();
    }
  }

  async abrirModificarPerfil(perfil: PerfilActualizar) {
    const popover = await this.popoverCtrl.create({
      component: AdminperfilpopoverComponent,
      componentProps: { perfil }
    });

    await popover.present();

    const { data } = await popover.onDidDismiss();
    if (data === 'editado' || data === 'creado') {
      this.cargarPerfiles();
    }
  }
}
