import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {MenuizquierdaconfigComponent} from "../menuizquierdaconfig/menuizquierdaconfig.component";
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import {addIcons} from "ionicons";
import {moon, moonOutline, sunny, sunnyOutline} from "ionicons/icons";

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
  notificacionesEmailActivadas: boolean = false;
  emailNotificacion: string = '';

  modo: boolean = true;

  constructor() {
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
    const modoGuardado = localStorage.getItem('modo');
    if (modoGuardado !== null) {
      this.modo = JSON.parse(modoGuardado);
    } else {
      this.modo = true;
    }
  }
 guardarCambios(){

 }

}
