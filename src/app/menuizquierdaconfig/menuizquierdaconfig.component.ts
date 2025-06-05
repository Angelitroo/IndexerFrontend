import { Component, OnInit } from '@angular/core';
import { IonicModule } from "@ionic/angular";
import { addIcons } from "ionicons";
import {
  arrowBackOutline, heartOutline,
  homeOutline, notificationsOutline,
  personOutline,
  settingsOutline,
  timeOutline // Asegúrate de importar timeOutline para el historial
} from "ionicons/icons";
import {Router, RouterLink} from "@angular/router";
import {AuthService} from "../services/auth.service";

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
  modo: boolean = true;
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
    addIcons({
      'home-outline': homeOutline,
      'person-outline': personOutline,
      'settings-outline': settingsOutline,
      'arrow-back-outline': arrowBackOutline,
      'time-outline': timeOutline,
      'heart-outline': heartOutline,
      'notifications-outline': notificationsOutline,
    });
  }

  ngOnInit() {
    const modoGuardado = localStorage.getItem('modo');
    if (modoGuardado !== null) {
      this.modo = JSON.parse(modoGuardado);
    } else {
      this.modo = true;
    }
  }

  inicio(){
    if (this.authService.esAdmin()) {
      this.router.navigateByUrl('/paneladmin');
    } else {
      this.router.navigateByUrl('/principal');
    }
  }
}
