import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {RouterLink} from "@angular/router";
import {NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    RouterLink,
    NgIf,
    FormsModule,
    NgForOf
  ]
})
export class LoginComponent  implements OnInit {
  isRegistro: boolean = false;
  paises: string[] = [
    'España', 'Francia', 'Alemania', 'Italia', 'Reino Unido', 'Portugal',
    'Bélgica', 'Países Bajos', 'Suecia', 'Noruega', 'Dinamarca', 'Finlandia',
    'Suiza', 'Austria', 'Polonia', 'República Checa', 'Hungría', 'Rumanía',
    'Bulgaria', 'Grecia'
  ];

  constructor() { }

  ngOnInit() {}

  cambioRegistro() {
    this.isRegistro = !this.isRegistro;
  }

}
