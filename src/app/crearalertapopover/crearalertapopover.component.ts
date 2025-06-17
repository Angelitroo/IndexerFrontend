import { Component, Input, OnInit } from '@angular/core';
import { IonicModule, PopoverController, ToastController } from "@ionic/angular";
import { FormsModule } from "@angular/forms";
import { Alerta } from "../models/Alerta";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-crearalertapopover',
  templateUrl: './crearalertapopover.component.html',
  styleUrls: ['./crearalertapopover.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    FormsModule,
    NgIf,
  ]
})
export class CrearalertapopoverComponent implements OnInit {
  modo: boolean = true;
  @Input() creandoAlerta: boolean = false;


  @Input() alerta: Partial<Alerta> = {
    concepto: '',
    precioObjetivo: undefined,
    empresas: []
  };

  constructor(
    private popoverCtrl: PopoverController,
    private toastController: ToastController,
  ) { }

  ngOnInit() {
    const modoGuardado = localStorage.getItem('modo');
    this.modo = modoGuardado ? JSON.parse(modoGuardado) : true;

    if (!this.alerta) {
      this.alerta = {
        concepto: '',
        precioObjetivo: undefined,
        empresas: []
      };
    }
  }

  async mostrarToast(mensaje: string, color: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      color,
      position: 'top'
    });
    await toast.present();
  }

  async crearAlerta(): Promise<void> {
    if (!this.alerta.concepto || !this.alerta.precioObjetivo || !this.alerta.empresas || this.alerta.empresas.length === 0) {
      this.mostrarToast('Todos los campos son obligatorios.', 'danger');
      return;
    }
    this.creandoAlerta = true;

    this.popoverCtrl.dismiss({
      submitted: true,
      data: this.alerta,
      creandoAlerta: true
    });
    setTimeout(() => {
      this.creandoAlerta = false;
    }, 10000);
  }

  cancelar(): void {
    this.popoverCtrl.dismiss();
  }
}
