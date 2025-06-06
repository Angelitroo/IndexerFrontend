import { Component, OnInit } from '@angular/core';
import { IonicModule, NavController } from "@ionic/angular";
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

  // Datos del perfil
  imagePath: string = '';
  nombre: string = '';
  username: string = '';
  correo: string = '';
  password: string = '';
  ubicacion: string = '';
  paises: string[] = [
    'España', 'Francia', 'Alemania', 'Italia', 'Reino Unido', 'Portugal', 'Bélgica',
    'Países Bajos', 'Suecia', 'Noruega', 'Dinamarca', 'Finlandia', 'Suiza', 'Austria',
    'Polonia', 'República Checa', 'Hungría', 'Rumanía', 'Bulgaria'
  ];

  constructor(
    private authService: AuthService,
    private perfilService: PerfilService,
    private navCtrl: NavController
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

  cargarDatosPerfil() {
    if (this.perfilId !== null) {
      this.perfilService.getActualizadoById(this.perfilId).subscribe({
        next: (data: any) => {  // Usamos 'any' temporalmente para debug
          console.log('📦 Perfil recibido del backend:', data);

          if (data) {
            this.imagePath = data.imagen || '';
            this.nombre = data.nombre || '';
            this.ubicacion = data.pais || '';
            this.username = data.username || '';

            // Manejo especial para el email (prioridad: correo > email > correonotificaciones)
            this.correo = data.correo || data.email || data.correonotificaciones || '';

            this.password = ''; // No cargamos la contraseña por seguridad

            console.log('Datos asignados:', {
              imagePath: this.imagePath,
              nombre: this.nombre,
              ubicacion: this.ubicacion,
              username: this.username,
              correo: this.correo
            });
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
      correo: this.correo,
      password: this.password
    };
    console.log('Enviando al backend:', perfilActualizado)

    this.perfilService.actualizarPerfil(perfilActualizado).subscribe({
      next: (response) => {
        console.log('Perfil actualizado con éxito:', response);
        this.navCtrl.navigateRoot('/perfil');
      },
      error: (error) => {
        console.error('Error al actualizar el perfil:', error);
        // Aquí podrías mostrar un toast o alerta al usuario
      }
    });
  }

  restablecerCampos() {
    this.cargarDatosPerfil(); // Vuelve a cargar los datos originales
  }
}
