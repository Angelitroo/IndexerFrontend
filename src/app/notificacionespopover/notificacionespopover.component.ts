import { Component, Input, OnInit } from '@angular/core';
import { IonicModule, PopoverController } from "@ionic/angular";
import { Notification } from "../models/notification.model";
import { NotificationService } from "../services/notification.service";
import { CommonModule } from "@angular/common";
import { finalize } from "rxjs/operators";

@Component({
  selector: 'app-notificacionespopover',
  templateUrl: './notificacionespopover.component.html',
  styleUrls: ['./notificacionespopover.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule
  ]
})
export class NotificacionespopoverComponent implements OnInit {
  @Input() notifications: Notification[] = [];
  modo: boolean = true;
  isLoading: boolean = false;

  constructor(
    private popoverCtrl: PopoverController,
    private notificationService: NotificationService
  ) {
    const modoGuardado = localStorage.getItem('modo');
    this.modo = modoGuardado !== null ? JSON.parse(modoGuardado) : true;
  }

  ngOnInit() {}

  get areAllNotificationsRead(): boolean {
    if (!this.notifications || this.notifications.length === 0) {
      return true;
    }
    return this.notifications.every(notification => notification.read);
  }

  markAllAsRead() {
    this.isLoading = true;
    this.notificationService.markAllAsRead().pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: () => {
        this.notifications.forEach(n => n.read = true);
        this.notificationService.triggerRefresh();
      },
      error: (err) => console.error('Failed to mark all as read', err)
    });
  }

  handleNotificationClick(notification: Notification) {
    if (!notification.read) {
      this.notificationService.markAsRead(notification.id).subscribe({
        next: () => {
          notification.read = true;
          this.notificationService.triggerRefresh();
        },
        error: (err) => console.error(`Failed to mark notification ${notification.id} as read`, err)
      });
    }

    if (notification.link) {
      window.open(notification.link, '_blank');
    }
  }

  getRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);

    if (seconds < 60) return `${seconds}s ago`;
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  }

  closePopover() {
    this.popoverCtrl.dismiss({ notificationsUpdated: true });
  }
}
