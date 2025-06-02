import { Component, OnInit } from '@angular/core';
import { IonicModule } from "@ionic/angular";
import { addIcons } from "ionicons";
import {
  arrowBackOutline,
  homeOutline,
  personOutline,
  settingsOutline,
  timeOutline // Asegúrate de importar timeOutline para el historial
} from "ionicons/icons";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-menuizquierdaperfil',
  templateUrl: './menuizquierdaperfil.component.html',
  styleUrls: ['./menuizquierdaperfil.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    RouterLink
  ]
})
export class MenuizquierdaperfilComponent implements OnInit {

  constructor() {
    addIcons({
      'home-outline': homeOutline,
      'person-outline': personOutline,
      'settings-outline': settingsOutline,
      'arrow-back-outline': arrowBackOutline,
      'time-outline': timeOutline // Agregado para el icono de historial
    });
  }

  ngOnInit() {}
}
