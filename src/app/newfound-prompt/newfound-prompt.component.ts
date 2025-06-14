import { Component, EventEmitter, Output } from '@angular/core';
import { IonicModule } from "@ionic/angular";
import { NgIf } from "@angular/common";
import { addIcons } from "ionicons";
import { sparklesOutline } from "ionicons/icons";

@Component({
  selector: 'app-newfound-prompt',
  templateUrl: './newfound-prompt.component.html',
  styleUrls: ['./newfound-prompt.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    NgIf
  ]
})
export class NewfoundPromptComponent {
  @Output() allow = new EventEmitter<void>();
  @Output() deny = new EventEmitter<void>();
  modo: boolean = true;
  productsfound: boolean = true;

  onAllowClick() {
    this.allow.emit();
  }

  onDenyClick() {
    this.productsfound = false;
    this.deny.emit();
  }

  constructor() {
    const modoGuardado = localStorage.getItem('modo');
    this.modo = modoGuardado !== null ? JSON.parse(modoGuardado) : true;

    addIcons({
      'sparkles-outline': sparklesOutline,
    });
  }
}
