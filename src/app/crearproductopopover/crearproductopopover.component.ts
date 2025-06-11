import { Component, Input, OnInit } from '@angular/core';
import { IonicModule, ToastController, PopoverController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ProductoService } from '../services/producto.service';
import { ProductAdmin } from "../models/ProductAdmin";

@Component({
  selector: 'app-crearproductopopover',
  templateUrl: './crearproductopopover.component.html',
  styleUrls: ['./crearproductopopover.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule]
})
export class CrearproductopopoverComponent implements OnInit {
  modo: boolean = true;

  @Input() set productadmin(value: ProductAdmin | undefined) {
    this._productadmin = value ? { ...value } : this.getDefaultProduct();
  }
  get productadmin(): ProductAdmin {
    return this._productadmin;
  }
  private _productadmin!: ProductAdmin;

  imagePath: string = '';

  constructor(
    private toastController: ToastController,
    private productoService: ProductoService,
    private popoverCtrl: PopoverController
  ) {
    const modoGuardado = localStorage.getItem('modo');
    this.modo = modoGuardado !== null ? JSON.parse(modoGuardado) : true;
  }

  ngOnInit() {
    if (this.productadmin.image) {
      this.imagePath = this.productadmin.image;
    }
  }

  private getDefaultProduct(): ProductAdmin {
    return {
      id: null,
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

  guardar() {
    if (!this.productadmin) return;

    this.productadmin.image = this.imagePath;

    if (this.productadmin.id) {
      this.productoService.updateProduct(this.productadmin.id, this.productadmin).subscribe({
        next: (updatedProduct) => {
          this.mostrarToast('Producto actualizado correctamente', 'success');
          this.popoverCtrl.dismiss({ status: 'editado', product: updatedProduct });
        },
        error: (err) => this.mostrarToast(`Error al actualizar: ${err.error}`, 'danger')
      });
    } else {
      this.productoService.addProduct(this.productadmin).subscribe({
        next: (createdProduct) => {
          this.mostrarToast('Producto creado correctamente', 'success');
          this.popoverCtrl.dismiss({ status: 'creado', product: createdProduct });
        },
        error: (err) => this.mostrarToast(`Error al crear: ${err.error}`, 'danger')
      });
    }
  }
}
