import { Component, Input, OnInit } from '@angular/core';
import { IonicModule, ToastController, PopoverController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Producto } from '../models/Producto';
import { ProductoService } from '../services/producto.service';

@Component({
  selector: 'app-crearproductopopover',
  templateUrl: './crearproductopopover.component.html',
  styleUrls: ['./crearproductopopover.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule]
})
export class CrearproductopopoverComponent implements OnInit {
  modo: boolean = true;

  @Input() producto: Producto = this.getDefaultProduct();

  imagePath: string = '';

  constructor(
    private toastController: ToastController,
    private productoService: ProductoService,
    private popoverCtrl: PopoverController
  ) {
    const modoGuardado = localStorage.getItem('modo');
    if (modoGuardado !== null) {
      this.modo = JSON.parse(modoGuardado);
    } else {
      this.modo = true;
    }
  }

  ngOnInit() {
    // Ensure producto is initialized
    if (!this.producto) {
      this.producto = this.getDefaultProduct();
    }

    if (this.producto.image) {
      this.imagePath = this.producto.image;
    }
  }

  private getDefaultProduct(): Producto {
    return {
      id: 0,
      favorito: false,
      title: '',
      discount: '',
      actualPrice: 0,
      oldPrice: 0,
      image: '',
      rating: '',
      delivery: '',
      url: '',
      empresa: ''
    };
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

  crearProducto(): void {
    const nuevoProducto: Partial<Producto> = {
      title: this.producto.title,
      actualPrice: this.producto.actualPrice,
      oldPrice: this.producto.oldPrice,
      image: this.imagePath,
      rating: this.producto.rating,
      delivery: this.producto.delivery,
      url: this.producto.url,
      empresa: this.producto.empresa
    };

    this.productoService.addProduct(nuevoProducto).subscribe({
      next: (productoCreado: Producto) => {
        this.mostrarToast('Producto creado con éxito', 'success');
        console.log('Producto creado/modificado:', productoCreado);
        this.popoverCtrl.dismiss(productoCreado); // Cierra el popover pasando el producto creado
      },
      error: (err: any) => {
        console.error(err);
        this.mostrarToast('Error al crear el producto', 'danger');
      }
    });
  }
}
