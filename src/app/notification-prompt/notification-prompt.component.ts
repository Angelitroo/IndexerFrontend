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

  onAllowClick() {
    this.allow.emit();
  }

  onDenyClick() {
    this.deny.emit();
  }
}
