import { Component, OnInit } from '@angular/core';
import {IonicModule, NavController, ToastController} from "@ionic/angular";
import {MenuizquierdaconfigComponent} from "../menuizquierdaconfig/menuizquierdaconfig.component";
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import {addIcons} from "ionicons";
import {moon, moonOutline, sunny, sunnyOutline} from "ionicons/icons";
import {PerfilService} from "../services/perfil.service";
import {AuthService} from "../services/auth.service";
import {PerfilActualizar} from "../models/PerfilActualizar";

@Component({
  selector: 'app-ajustes',
  templateUrl: './ajustes.component.html',
  styleUrls: ['./ajustes.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    MenuizquierdaconfigComponent,
    FormsModule,
    NgIf
  ]
})
export class AjustesComponent implements OnInit {
  notificacionesEmailActivadas: boolean = true;
  modo: boolean = true;

  perfilId: number | null = null;
  imagePath: string = '';
  nombre: string = '';
  username: string = '';
  email: string = '';
  password: string = '';
  ubicacion: string = '';
  correonotificaciones: string = '';



  constructor(
    private authService: AuthService,
    private perfilService: PerfilService,
    private navCtrl: NavController,
    private toastController: ToastController
  )
  {
    addIcons({
      'moon-outline': moonOutline,
      'moon': moon,
      'sunny-outline': sunnyOutline,
      'sunny': sunny,

      }
    )
  }
  setModo(modo: boolean) {
    this.modo = modo;
    localStorage.setItem('modo', JSON.stringify(modo));
    window.location.reload();
  }




  ngOnInit() {
    this.perfilId = this.authService.getPerfilIdFromToken();
    this.cargarDatosPerfil();

    const modoGuardado = localStorage.getItem('modo');
    if (modoGuardado !== null) {
      this.modo = JSON.parse(modoGuardado);
    } else {
      this.modo = true;
    }

    const notificacionesGuardadas = sessionStorage.getItem('notificacionesEmailActivadas');
    if (notificacionesGuardadas !== null) {
      this.notificacionesEmailActivadas = JSON.parse(notificacionesGuardadas);
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
      correonotificaciones : this.correonotificaciones
    };
    console.log('Enviando al backend:', perfilActualizado)

    this.perfilService.actualizarPerfil(perfilActualizado).subscribe({
      next: (response) => {
        this.presentToast('Perfil actualizado con éxito', 'success');
        console.log('Correo actualizado con éxito:', response.correonotificaciones);
        this.navCtrl.navigateRoot('/ajustes');
      },
      error: (error) => {
        console.error('Error al actualizar el correo:', error);
      }
    });
  }

  actualizarNotificacionesEmail() {
    sessionStorage.setItem('notificacionesEmailActivadas', JSON.stringify(this.notificacionesEmailActivadas));

    if (!this.notificacionesEmailActivadas) {
      this.correonotificaciones = '';

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
        correonotificaciones: ''
      };

      this.perfilService.actualizarPerfil(perfilActualizado).subscribe({
        next: () => {
          this.presentToast('Notificaciones por correo desactivadas', 'success');
        },
        error: (error) => {
          console.error('Error al actualizar notificaciones:', error);
          this.presentToast('Hubo un error al actualizar', 'danger');
        }
      });
    }
  }




  cargarDatosPerfil() {
    if (this.perfilId !== null) {
      this.perfilService.getActualizadoById(this.perfilId).subscribe({
        next: (data: any) => {  // Usamos 'any' temporalmente para debug
          console.log('📦 Perfil recibido del backend:', data.id);

          if (data) {
            this.imagePath = data.imagen || '';
            this.nombre = data.nombre || '';
            this.ubicacion = data.pais || '';
            this.username = data.username || '';
            this.correonotificaciones = data.correonotificaciones || '';

            // Manejo especial para el email (prioridad: correo > email > correonotificaciones)
            this.email = data.email || data.email || data.correonotificaciones || '';

            this.password = ''; // No cargamos la contraseña por seguridad

            console.log('Datos asignados:', {
              imagePath: this.imagePath,
              nombre: this.nombre,
              ubicacion: this.ubicacion,
              username: this.username,
              email: this.email,
              correonotificaciones: this.correonotificaciones
            });
          }
        },
        error: (error) => {
          console.error('Error al obtener el perfil:', error);
        }
      });
    }
  }

}
