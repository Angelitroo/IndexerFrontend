import { Component, OnInit } from '@angular/core';
import { IonicModule } from "@ionic/angular";
import { addIcons } from "ionicons";
import {
  arrowBackOutline, heartOutline,
  homeOutline,
  personOutline,
  settingsOutline,
  timeOutline // Asegúrate de importar timeOutline para el historial
} from "ionicons/icons";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-menuizquierdaconfig',
  templateUrl: './menuizquierdaconfig.component.html',
  styleUrls: ['./menuizquierdaconfig.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    RouterLink
  ]
})
export class MenuizquierdaconfigComponent implements OnInit {

  constructor() {
    addIcons({
      'home-outline': homeOutline,
      'person-outline': personOutline,
      'settings-outline': settingsOutline,
      'arrow-back-outline': arrowBackOutline,
      'time-outline': timeOutline,
      'heart-outline': heartOutline,
    });
  }

  ngOnInit() {}
}
