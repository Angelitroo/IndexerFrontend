import { Component, OnInit } from '@angular/core';
import {IonicModule, PopoverController, ToastController} from "@ionic/angular";

@Component({
  selector: 'app-notificacionespopover',
  templateUrl: './notificacionespopover.component.html',
  styleUrls: ['./notificacionespopover.component.scss'],
  standalone: true,
  imports: [
    IonicModule
  ]
})
export class NotificacionespopoverComponent  implements OnInit {
  modo: boolean = true;

  constructor(
    private toastController: ToastController,
    private popoverCtrl: PopoverController
  ) {
    const modoGuardado = localStorage.getItem('modo');
    this.modo = modoGuardado !== null ? JSON.parse(modoGuardado) : true;
  }

  ngOnInit() {}

  aceptar(){
    this.popoverCtrl.dismiss()
  }

}
