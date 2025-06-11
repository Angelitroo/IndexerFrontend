import { Component, Input, OnInit } from '@angular/core';
import { IonicModule, ToastController, PopoverController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ProductAdmin } from "../models/ProductAdmin";
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
  productadmin!: ProductAdmin;
  isEditMode: boolean = false;
  private originalUrlForUpdate: string | null = null;
  imagePath: string = '';

  @Input() set productadminInput(value: ProductAdmin | undefined) {
    if (value) {
      this.isEditMode = true;
      this.productadmin = { ...value };
      this.originalUrlForUpdate = value.url;
    } else {
      this.isEditMode = false;
      this.productadmin = this.getDefaultProduct();
    }
  }

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

    if (this.isEditMode) {
      this.productoService.updateProduct(this.originalUrlForUpdate!, this.productadmin).subscribe({
        next: () => {
          this.mostrarToast('Producto actualizado correctamente', 'success');
          this.popoverCtrl.dismiss('editado');
        },
        error: (err) => {
          console.error('Error updating product:', err);
          this.mostrarToast('Error al actualizar el producto', 'danger');
        }
      });
    } else {
      this.productoService.addProduct(this.productadmin).subscribe({
        next: () => {
          this.mostrarToast('Producto creado correctamente', 'success');
          this.popoverCtrl.dismiss('creado');
        },
        error: (err) => {
          console.error('Error creating product:', err);
          this.mostrarToast('Error al crear el producto', 'danger');
        }
      });
    }
  }
}
