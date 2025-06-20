import {Component, Input, OnInit} from '@angular/core';
import {IonicModule, PopoverController, ToastController} from "@ionic/angular";
import {FormsModule} from "@angular/forms";
import {Producto} from "../models/Producto";
import {Alerta} from "../models/Alerta";
import {AlertaService} from "../services/alerta.service";

@Component({
  selector: 'app-crearalertapopover',
  templateUrl: './crearalertapopover.component.html',
  styleUrls: ['./crearalertapopover.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    FormsModule
  ]
})
export class CrearalertapopoverComponent  implements OnInit {
  modo: boolean = true;

  @Input() alerta: Alerta = {
    id: 0,
    concepto: '',
    precio: 0
  };


  constructor(
    private alertaService: AlertaService,
    private popoverCtrl: PopoverController,
    private toastController: ToastController,
  ) { }

  ngOnInit() {
    const modoGuardado = localStorage.getItem('modo');
    if (modoGuardado !== null) {
      this.modo = JSON.parse(modoGuardado);
    } else {
      this.modo = true;
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

  crearAlerta(): void {
    this.popoverCtrl.dismiss(true); // Cierra el popover inmediatamente
    const nuevaAlerta: Partial<Alerta> = {
      concepto : this.alerta.concepto,
      precio: this.alerta.precio
    };
    this.alertaService.crearAlerta(nuevaAlerta).subscribe({
      next: () => {
        this.mostrarToast('Alerta creada con éxito', 'success');
      },
      error: (err: any) => {
        console.error(err);
        this.mostrarToast('Error al crear Alerta', 'danger');
      }
    });
  }

}
