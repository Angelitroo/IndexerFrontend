import { Component, OnInit } from '@angular/core';
import {IonicModule, NavController} from "@ionic/angular";
import {FormsModule} from "@angular/forms";
import {MenuizquierdaperfilComponent} from "../menuizquierdaperfil/menuizquierdaperfil.component";
import {NgForOf} from "@angular/common";

@Component({
    selector: 'app-modificarperfil',
    templateUrl: './modificarperfil.component.html',
    styleUrls: ['./modificarperfil.component.scss'],
    standalone: true,
  imports: [
    IonicModule,
    FormsModule,
    MenuizquierdaperfilComponent,
    NgForOf
  ]
})
export class ModificarperfilComponent {
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

  constructor(private navCtrl: NavController) {}

  guardarCambios() {
    console.log('Cambios guardados:', {
      nombre: this.nombre,
      correo: this.correo,
      ubicacion: this.ubicacion,
      imagen: this.imagePath,
    });
    this.volver();
  }

  volver() {
    this.navCtrl.back();
  }
}
