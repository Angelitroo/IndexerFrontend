import { Component, OnInit } from '@angular/core';
import {IonicModule, NavController} from "@ionic/angular";
import {FormsModule} from "@angular/forms";
import {MenuizquierdaconfigComponent} from "../menuizquierdaconfig/menuizquierdaconfig.component";
import {NgForOf, NgIf} from "@angular/common";
import {Perfil} from "../models/Perfil";
import {AuthService} from "../services/auth.service";
import {PerfilService} from "../services/perfil.service";

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
  correo: string = '';
  password: string = '';
  ubicacion: string = '';
  paises: string[] = [
    'España', 'Francia', 'Alemania', 'Italia', 'Reino Unido', 'Portugal', 'Bélgica',
    'Países Bajos', 'Suecia', 'Noruega', 'Dinamarca', 'Finlandia', 'Suiza', 'Austria',
    'Polonia', 'República Checa', 'Hungría', 'Rumanía', 'Bulgaria'
  ];

  constructor(
    private authService : AuthService,
    private perfilService: PerfilService,
    ) {}

  guardarCambios() {
    console.log('Cambios guardados:', {
      nombre: this.nombre,
      correo: this.correo,
      ubicacion: this.ubicacion,
      imagen: this.imagePath,
    });
  }

  ngOnInit() {
    this.perfilId = this.authService.getPerfilIdFromToken();

    if (this.perfilId !== null) {
      this.perfilService.getPerfilById(this.perfilId).subscribe({
        next: (data: Perfil) => {
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
}
