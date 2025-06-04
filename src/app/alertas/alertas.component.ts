import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {MenuizquierdaconfigComponent} from "../menuizquierdaconfig/menuizquierdaconfig.component";
import {NgForOf} from "@angular/common";
import {Busqueda} from "../models/Busqueda";
import {Alerta} from "../models/Alerta";
import {addIcons} from "ionicons";
import {trashOutline} from "ionicons/icons";

@Component({
  selector: 'app-alertas',
  templateUrl: './alertas.component.html',
  styleUrls: ['./alertas.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    MenuizquierdaconfigComponent,
    NgForOf
  ]
})
export class AlertasComponent  implements OnInit {
  modo: boolean = true;
  alertas: Alerta[] = [
    {
      id:1,
      concepto: 'Play Station 5',
      precio:460,
    },
    {
      id:2,
      concepto: 'Xiaomi Redmi Note 12',
      precio:180,
    },
    {
      id:3,
      concepto: 'Samsung Galaxy S23',
      precio:800,
    },
    {
      id:4,
      concepto: 'iPhone 14 Pro Max',
      precio:1200,
    },
    {
      id:5,
      concepto: 'Televisor LG OLED 55"',
      precio:1500,
    },
    {
      id:6,
      concepto: 'Portátil Dell XPS 13',
      precio:1300,
    },
    {
      id:7,
      concepto: 'Auriculares Sony WH-1000XM4',
      precio:350,
    },
    {
      id:8,
      concepto: 'Reloj inteligente Apple Watch Series 8',
      precio:400,
    }
  ];

  constructor() {
    addIcons({
      'trash-outline': trashOutline,
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
  eliminarAlerta(alerta: Alerta) {
    this.alertas = this.alertas.filter(a => a.id !== alerta.id);
  }

}
