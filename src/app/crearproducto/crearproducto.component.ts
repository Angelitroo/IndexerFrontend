import { Component, OnInit } from '@angular/core';
import { IonicModule, ToastController } from "@ionic/angular"; // Import ToastController
import { MenuizquierdaComponent } from "../menuizquierda/menuizquierda.component";
import { NgForOf, NgIf } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Producto } from "../models/Producto";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";
import { ProductoService } from "../services/producto.service";

@Component({
  selector: 'app-crearproducto',
  templateUrl: './crearproducto.component.html',
  styleUrls: ['./crearproducto.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    MenuizquierdaComponent,
    NgForOf,
    NgIf,
    FormsModule
  ]
})
export class CrearproductoComponent implements OnInit {
  producto: Producto = {
    id: 0,
    title: '',
    discount: '',
    actualPrice: 0,
    oldPrice: 0,
    image: '',
    rating: '',
    delivery: '',
    url: ''
  };

  imagePath: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private productoService: ProductoService,
    private toastController: ToastController
  ) {}

  ngOnInit() {}

  async mostrarToast(mensaje: string, color: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      color: color,
      position: 'top'
    });
    toast.present();
  }

  crearProducto(): void {
    const perfilId: number | undefined = this.authService.getPerfilIdFromToken() ?? undefined;
    console.log('Perfil ID:', perfilId);

    const nuevoProducto: Partial<Producto> = {
      title: this.producto.title,
      discount: this.producto.discount,
      actualPrice: this.producto.actualPrice,
      oldPrice: this.producto.oldPrice,
      image: this.imagePath,
      rating: this.producto.rating,
      delivery: this.producto.delivery,
      url: this.producto.url
    };

    if (perfilId !== undefined) {
      this.productoService.guardarProducto(perfilId, nuevoProducto).subscribe({
        next: () => {
          this.mostrarToast('Producto creado con éxito', 'success');
          this.router.navigate(['/productos']).then(() => {
            window.location.reload();
          });
        },
        error: (err: any) => {
          console.error(err);
          this.mostrarToast('Error al crear el producto', 'danger');
        }
      });
    }
  }

  modificarProducto(): void {}
  eliminarProducto(): void {}
}
