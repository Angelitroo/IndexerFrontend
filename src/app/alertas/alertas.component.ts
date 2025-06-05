import { Component, OnInit } from '@angular/core';
import { IonicModule } from "@ionic/angular";
import { MenuizquierdaconfigComponent } from "../menuizquierdaconfig/menuizquierdaconfig.component";
import { NgForOf, NgClass } from "@angular/common";
import { Alerta } from "../models/Alerta";
import { AlertaService } from '../services/alerta.service';
import { addIcons } from "ionicons";
import { trashOutline, notificationsOutline } from "ionicons/icons";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-alertas',
  templateUrl: './alertas.component.html',
  styleUrls: ['./alertas.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    MenuizquierdaconfigComponent,
    NgForOf,
    NgClass,
    FormsModule
  ]
})
export class AlertasComponent implements OnInit {
  modo: boolean = true;
  alertas: Alerta[] = [];

  newAlertaConcepto: string = '';
  newAlertaPrecio: number | undefined;
  newAlertaEmpresas: string = '';

  constructor(private alertaService: AlertaService) {
    addIcons({
      'trash-outline': trashOutline,
      'notifications-outline': notificationsOutline
    });
  }

  ngOnInit() {
    const modoGuardado = localStorage.getItem('modo');
    this.modo = modoGuardado ? JSON.parse(modoGuardado) : true;
    this.cargarAlertas();
  }

  cargarAlertas() {
    this.alertaService.getAlertas().subscribe({
      next: (data) => {
        this.alertas = data;
        console.log('Alertas loaded successfully:', data);
      },
      error: (err) => console.error('Error fetching alerts:', err)
    });
  }

  crearNuevaAlerta() {
    if (!this.newAlertaConcepto || !this.newAlertaPrecio || !this.newAlertaEmpresas) {
      console.error('All fields are required.');
      return;
    }

    const empresasArray = this.newAlertaEmpresas.split(',').map(e => e.trim()).filter(e => e);

    const alertaPayload: Partial<Alerta> = {
      concepto: this.newAlertaConcepto,
      precioObjetivo: this.newAlertaPrecio,
      empresas: empresasArray
    };

    this.alertaService.crearAlerta(alertaPayload).subscribe({
      next: (alertaCreada) => {
        console.log('Alert created successfully:', alertaCreada);
        this.alertas.push(alertaCreada);
        this.newAlertaConcepto = '';
        this.newAlertaPrecio = undefined;
        this.newAlertaEmpresas = '';
      },
      error: (err) => console.error('Error creating alert:', err)
    });
  }

  eliminarAlerta(alerta: Alerta) {
    this.alertaService.eliminarAlerta(alerta.id).subscribe({
      next: () => {
        this.alertas = this.alertas.filter(a => a.id !== alerta.id);
        console.log(`Alert with id ${alerta.id} deleted successfully.`);
      },
      error: (err) => console.error('Error deleting alert:', err)
    });
  }
}
