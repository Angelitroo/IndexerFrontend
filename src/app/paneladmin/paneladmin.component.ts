import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {MenuizquierdaComponent} from "../menuizquierda/menuizquierda.component";
import {NgForOf, NgIf} from "@angular/common";
import {Perfil} from "../models/Perfil";
import {AuthService} from "../services/auth.service";
import {PerfilService} from "../services/perfil.service";
import {RouterLink} from "@angular/router";

@Component({
    selector: 'app-paneladmin',
    templateUrl: './paneladmin.component.html',
    styleUrls: ['./paneladmin.component.scss'],
    standalone: true,
  imports: [
    IonicModule,
    RouterLink,
    NgForOf,
  ]
})
export class PaneladminComponent  implements OnInit {
  perfilId: number | null = null;

  perfil: Perfil | null = null;
  perfiles: Perfil[] = [
    {
      id: 1,
      nombre: 'Juan',
      apellido: 'Pérez',
      ubicacion: 'Madrid, España',
      imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbGgko7AggykEsN6k1_Ddj4_U_PPzeIeENUA&s',
      baneado: false,
      perfil: 1,
    },
    {
      id: 2,
      nombre: 'María',
      apellido: 'Gómez',
      ubicacion: 'Barcelona, España',
      imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6BkDNK7JcwMkGJWKpV3lR4Wqp_UOuj-IEHw&s',
      baneado: true,
      perfil: 2,
    },
    {
      id: 3,
      nombre: 'Carlos',
      apellido: 'López',
      ubicacion: 'Valencia, España',
      imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfNdlbCFhb0ctP_AWbNurXGhv55OGg2k0rcg&s',
      baneado: false,
      perfil: 3,
    },
    {
      id: 4,
      nombre: 'Ana',
      apellido: 'Martínez',
      ubicacion: 'Sevilla, España',
      imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQB2Mvs7EKFjH0K0g8Pm6nJ-Qi1PJnsTSdyww&s',
      baneado: false,
      perfil: 4,
    },
    {
      id: 5,
      nombre: 'Gonzalo',
      apellido: 'Gomez Monasterio',
      ubicacion: 'Panchitolandia, Venezuela',
      imagen: 'https://i.imgflip.com/4151ec.jpg?a485064',
      baneado: true,
      perfil: 5,
    },
    {
      id: 6,
      nombre: 'Sofía',
      apellido: 'Ramírez',
      ubicacion: 'Granada, España',
      imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6sPxq4Um5j7M2ATQhcU3RqSFjQWbp9aLDew&s',
      baneado: false,
      perfil: 6,
    },
    {
      id: 7,
      nombre: 'Diego',
      apellido: 'Fernández',
      ubicacion: 'Zaragoza, España',
      imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQA3u8HgIoupxD26I7FCGvwTTh9nhd5ViqFaQ&s',
      baneado: false,
      perfil: 7,
    },
    {
      id: 8,
      nombre: 'Lucía',
      apellido: 'García',
      ubicacion: 'Málaga, España',
      imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuw4XWNiOLg6qbNBIlqUuQPJrDRse9Kt8cxA&s',
      baneado: true,
      perfil: 8,
    },
    {
      id: 9,
      nombre: 'Javier',
      apellido: 'Sánchez',
      ubicacion: 'Alicante, España',
      imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgrgziWJTmWQijYB_Egtf3aFP9TY4Ac3fL2A&s',
      baneado: false,
      perfil: 9,
    },
    {
      id: 10,
      nombre: 'Elena',
      apellido: 'Torres',
      ubicacion: 'Córdoba, España',
      imagen: 'https://i.redd.it/n3tcn9mdij151.jpg',
      baneado: false,
      perfil: 10,
    },
  ];



  constructor(
    private authService: AuthService,
    private perfilService: PerfilService,
  ) {  }

  ngOnInit(){
    this.perfilId = this.authService.getPerfilIdFromToken();
    this.cargarMiPerfil();
    this.perfilService.getPerfiles().subscribe({
      next: (data: Perfil[]) => {
        this.perfiles = data;
      },
    });
  }

  private cargarMiPerfil(perfilId?: number | null) {
    if (!perfilId) {
      perfilId = this.authService.getPerfilIdFromToken();
    }
    console.log('Perfil ID:', perfilId);
    if (perfilId) {
      this.perfilService.getPerfilById(perfilId).subscribe({
        next: (data: Perfil) => {
          this.perfil = data;
        },
      });
    }
  }
}
