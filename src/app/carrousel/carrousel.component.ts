import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common'; // <-- ¡Importa esto!
import { SwiperModule } from 'swiper/angular';
import SwiperCore, { Navigation, Pagination } from 'swiper';

// Activamos los módulos Swiper que necesitas
SwiperCore.use([Navigation, Pagination]);

@Component({
  selector: 'app-carrousel',
  templateUrl: './carrousel.component.html',
  styleUrls: ['./carrousel.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, SwiperModule] // <-- ¡Agrega CommonModule aquí!
})
export class CarrouselComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
