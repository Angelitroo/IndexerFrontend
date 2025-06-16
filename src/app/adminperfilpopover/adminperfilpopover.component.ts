import { Component, OnInit } from '@angular/core';
import { IonicModule, PopoverController } from "@ionic/angular";
import { FormsModule } from "@angular/forms";
import { PerfilService } from "../services/perfil.service";
import { ToastController } from "@ionic/angular";
import { PerfilActualizar } from "../models/PerfilActualizar";

@Component({
  selector: 'app-adminperfilpopover',
  templateUrl: './adminperfilpopover.component.html',
  styleUrls: ['./adminperfilpopover.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    FormsModule
  ]
})
export class AdminperfilpopoverComponent implements OnInit {
  modo: boolean = true;
  imagePath: string = '';
  perfil: PerfilActualizar;

  constructor(
    private popoverCtrl: PopoverController,
    private perfilService: PerfilService,
    private toastController: ToastController
  ) {
    this.perfil = this.getDefaultPerfil();
    const modoGuardado = localStorage.getItem('modo');
    this.modo = modoGuardado !== null ? JSON.parse(modoGuardado) : true;
  }

  ngOnInit() {
    if (this.perfil.imagen) {
      this.imagePath = this.perfil.imagen;
    }
  }

  private getDefaultPerfil(): PerfilActualizar {
    return {
      id: 0,
      nombre: '',
      pais: '',
      imagen: '',
      username: '',
      email: '',
      password: '',
      baneado: false,
      correonotificaciones: '',
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
    const perfilActualizar: PerfilActualizar = {
      ...this.perfil,
      imagen: this.imagePath,
      password: null
    };

    this.perfilService.actualizarPerfil(perfilActualizar).subscribe({
      next: () => {
        this.mostrarToast('Perfil actualizado correctamente', 'success');
        this.popoverCtrl.dismiss({ data: 'editado' });
      },
      error: (error) => {
        console.error('Error al modificar el perfil:', error);
        this.mostrarToast('Error al modificar el perfil', 'danger');
      }
    });
  }
}
