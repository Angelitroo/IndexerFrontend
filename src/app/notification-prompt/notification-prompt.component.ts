import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-notification-prompt',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './notification-prompt.component.html',
  styleUrls: ['./notification-prompt.component.scss'],
})
export class NotificationPromptComponent {
  @Output() allow = new EventEmitter<void>();
  @Output() deny = new EventEmitter<void>();
  modo: boolean = true;

  onAllowClick() {
    window.location.reload();
  }

  onDenyClick() {
    this.deny.emit();
  }

  constructor() {
    const modoGuardado = localStorage.getItem('modo');
    this.modo = modoGuardado !== null ? JSON.parse(modoGuardado) : true;
  }
}
