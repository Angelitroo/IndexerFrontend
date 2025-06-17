import { Component, OnInit } from '@angular/core';
import { IonicModule, ToastController } from "@ionic/angular";
import { MenuizquierdaconfigComponent } from "../menuizquierdaconfig/menuizquierdaconfig.component";
import { Busqueda } from "../models/Busqueda";
import { CommonModule } from '@angular/common';
import { HistorialService } from "../services/historial.service";

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    MenuizquierdaconfigComponent,
    CommonModule,
  ]
})
export class HistorialComponent  implements OnInit {
  modo: boolean = true;
  historial : Busqueda[] = [];
  isLoading: boolean = false;
  isDeleting: boolean = false;
  errorMensaje: string | null = null;
  selectedItems: Set<number> = new Set<number>();

  constructor(
    private historialService: HistorialService,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    const modoGuardado = localStorage.getItem('modo');
    if (modoGuardado !== null) {
      this.modo = JSON.parse(modoGuardado);
    } else {
      this.modo = true;
    }
    this.cargarHistorial();
  }
  ionViewWillEnter() {
    this.cargarHistorial();
  }
  cargarHistorial() {
    this.isLoading = true;
    this.errorMensaje = null;
    this.selectedItems.clear(); // Correcto

    this.historialService.getHistorialUsuario().subscribe({
      next: (data: Busqueda[]) => {
        this.historial = data;
        this.isLoading = false;
      },

      error: async (err: any) => {
        console.error('Error al cargar el historial:', err);
        let detalleError = `(${err.status || 'sin status'})`;
        if (err.message) {
          detalleError += `: ${err.message}`;
        } else if (err.error && err.error.message) {
          detalleError += `: ${err.error.message}`;
        } else if (typeof err.error === 'string') {
          detalleError += `: ${err.error}`;
        } else {
          detalleError += ': Error desconocido al cargar.';
        }

        const mensajeFinal = `Ocurrió un error al cargar el historial ${detalleError} Inténtalo más tarde.`;
        await this.mostrarToast(mensajeFinal, 'danger');
        this.errorMensaje = mensajeFinal;
        this.isLoading = false;
      }
    });
  }

  onCheckboxChange(event: any, busquedaId: number) {
    if (event.detail.checked) {
      this.selectedItems.add(busquedaId);
    } else {
      this.selectedItems.delete(busquedaId);
    }
  }

  hayItemsSeleccionados(): boolean {
    return this.selectedItems.size > 0;
  }

  eliminarSeleccionados() {
    if (this.selectedItems.size === 0 || this.isDeleting) {
      return;
    }

    const idsParaEliminar = Array.from(this.selectedItems);
    this.isDeleting = true;
    this.errorMensaje = null;

    this.historialService.deleteHistorialItems(idsParaEliminar).subscribe({
      next: async () => {
        console.log('Items eliminados con éxito del backend');
        await this.mostrarToast('Historial eliminado correctamente.', 'success');
        this.isDeleting = false;
        this.cargarHistorial();
      },
      error: async (err: any) => {
        console.error('Error al eliminar items:', err);
        const mensajeError = `Error al eliminar (${err.status || 'sin status'}): ${err.message || err.error?.message || 'Error desconocido'}`;
        await this.mostrarToast(mensajeError, 'danger');
        this.errorMensaje = 'Error al eliminar los items seleccionados.';
        this.isDeleting = false;
      }
    });
  }

  async mostrarToast(mensaje: string, color: 'success' | 'danger' | 'warning' | 'primary' | 'secondary' | 'tertiary' | 'medium' | 'light' | 'dark' = 'primary', duration: number = 3000) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: duration,
      position: 'bottom',
      color: color,
      buttons: [{ text: 'Cerrar', role: 'cancel' }]
    });
    await toast.present();
  }
}
