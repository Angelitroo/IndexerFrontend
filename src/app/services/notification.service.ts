import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Notification } from '../models/notification.model';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, Messaging } from 'firebase/messaging';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = 'http://localhost:8080/api/notifications';
  private userApiUrl = 'http://localhost:8080/usuarios';
  private notificationSubject = new Subject<void>();
  private firebaseApp: FirebaseApp;
  private messaging: Messaging;

  public notifications$ = this.notificationSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private toastController: ToastController
  ) {
    this.firebaseApp = initializeApp(environment.firebaseConfig);
    this.messaging = getMessaging(this.firebaseApp);
    this.listenForForegroundMessages();
  }

  getPermissionState(): NotificationPermission {
    return Notification.permission;
  }

  getNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(this.apiUrl, this.authService.getAuthHeaders());
  }

  getUnreadCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/unread-count`, this.authService.getAuthHeaders());
  }

  markAsRead(id: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/read`, {}, this.authService.getAuthHeaders());
  }

  markAllAsRead(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/read-all`, {}, this.authService.getAuthHeaders());
  }

  subscribeToSseNotifications(): EventSource {
    const token = this.authService.getToken();

    if (!token) {
      console.error('SSE Error: No auth token found. Cannot subscribe.');
      return new EventSource('about:blank');
    }

    const urlWithToken = `${this.apiUrl}/subscribe?token=${encodeURIComponent(token)}`;
    const eventSource = new EventSourcePolyfill(urlWithToken);

    eventSource.addEventListener('new_notification', () => {
      this.notificationSubject.next();
    });

    eventSource.onerror = (error: any) => {
      console.error('SSE Error:', error);
    };

    return eventSource;
  }

  triggerRefresh() {
    this.notificationSubject.next();
  }

  public requestPushPermissionAndToken() {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        this.retrieveAndSendFcmToken();
      } else {
        console.error('Unable to get permission for push notifications.');
      }
    });
  }

  private retrieveAndSendFcmToken() {
    getToken(this.messaging, { vapidKey: environment.firebaseConfig.vapidKey })
      .then((currentToken) => {
        if (currentToken) {
          this.sendFcmTokenToBackend(currentToken);
        } else {
          console.log('No registration token available. Request permission to generate one.');
        }
      })
      .catch((err) => {
        console.error('An error occurred while retrieving FCM token.', err);
      });
  }

  private sendFcmTokenToBackend(token: string) {
    const endpoint = `${this.userApiUrl}/fcm-token`;
    const options = this.authService.getAuthHeaders();
    this.http.post(endpoint, { token }, options).subscribe({
      next: () => console.log('FCM token sent to backend successfully.'),
      error: (err) => console.error('Error sending FCM token to backend.', err),
    });
  }

  private listenForForegroundMessages() {
    onMessage(this.messaging, (payload) => {
      console.log('Push message received while app is in foreground.', payload);
      this.notificationSubject.next();

      if (payload.data) {
        const title = payload.data['title'];
        const body = payload.data['body'];
        this.showInAppToast(title, body);
      }
    });
  }

  async showInAppToast(title: string, body: string) {
    const toast = await this.toastController.create({
      header: title,
      message: body,
      duration: 5000,
      position: 'top',
      color: 'primary',
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel'
        }
      ]
    });
    await toast.present();
  }
}
