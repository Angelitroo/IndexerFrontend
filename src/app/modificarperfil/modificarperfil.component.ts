import { Component, OnInit } from '@angular/core';
import {IonicModule, NavController, ToastController} from "@ionic/angular";
import { FormsModule } from "@angular/forms";
import { MenuizquierdaconfigComponent } from "../menuizquierdaconfig/menuizquierdaconfig.component";
import { NgForOf, NgIf } from "@angular/common";
import { Perfil } from "../models/Perfil";
import { AuthService } from "../services/auth.service";
import { PerfilService } from "../services/perfil.service";
import { PerfilActualizar } from "../models/PerfilActualizar";

@Component({
  selector: 'app-modificarperfil',
  templateUrl: './modificarperfil.component.html',
  styleUrls: ['./modificarperfil.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    FormsModule,
    MenuizquierdaconfigComponent,
    NgForOf,
    NgIf
  ]
})
export class ModificarperfilComponent implements OnInit {
  perfilId: number | null = null;
  modo: boolean = true;

  imagePath: string = '';
  nombre: string = '';
  username: string = '';
  email: string = '';
  password: string = '';
  ubicacion: string = '';
  paises: string[] = [
    'España', 'Francia', 'Alemania', 'Italia', 'Reino Unido', 'Portugal', 'Bélgica',
    'Países Bajos', 'Suecia', 'Noruega', 'Dinamarca', 'Finlandia', 'Suiza', 'Austria',
    'Polonia', 'República Checa', 'Hungría', 'Rumanía', 'Bulgaria'
  ];
  correonotificaciones: string = '';

  constructor(
    private authService: AuthService,
    private perfilService: PerfilService,
    private navCtrl: NavController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.perfilId = this.authService.getPerfilIdFromToken();
    this.cargarDatosPerfil();

    const modoGuardado = localStorage.getItem('modo');
    if (modoGuardado !== null) {
      this.modo = JSON.parse(modoGuardado);
    } else {
      this.modo = true;
    }
  }

  async presentToast(message: string, color: 'success' | 'danger' = 'danger') {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      color: color
    });
    toast.present();
  }


  cargarDatosPerfil() {
    if (this.perfilId !== null) {
      this.perfilService.getActualizadoById(this.perfilId).subscribe({
        next: (data: any) => {
          console.log('📦 Perfil recibido del backend:', data.id);

          if (data) {
            this.imagePath = data.imagen || '';
            this.nombre = data.nombre || '';
            this.ubicacion = data.pais || '';
            this.username = data.username || '';
            this.email = data.email || '';
            this.correonotificaciones = data.correonotificaciones || '';
            this.password = '';
          }
        },
        error: (error) => {
          console.error('Error al obtener el perfil:', error);
        }
      });
    }
  }

  guardarCambios() {
    if (this.perfilId === null) {
      console.error('No se puede actualizar el perfil sin ID');
      return;
    }

    const perfilActualizado: PerfilActualizar = {
      id: this.perfilId,
      imagen: this.imagePath,
      nombre: this.nombre,
      pais: this.ubicacion,
      username: this.username,
      email: this.email,
      password: this.password,
      correonotificaciones: this.correonotificaciones
    };
    console.log('Enviando al backend:', perfilActualizado)

    this.perfilService.actualizarPerfil(perfilActualizado).subscribe({
      next: (response) => {
        this.presentToast('Perfil actualizado con éxito', 'success');
        console.log('Perfil actualizado con éxito:', response);
        this.cargarDatosPerfil();
      },
      error: (error) => {
        console.error('Error al actualizar el perfil:', error);
        this.presentToast('Error al actualizar el perfil', 'danger');
      }
    });
  }

  restablecerCampos() {
    this.cargarDatosPerfil();
  }
}
