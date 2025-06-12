import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Notification } from '../models/notification.model';
import { EventSourcePolyfill } from 'event-source-polyfill';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private apiUrl = 'http://localhost:8080/api/notifications';
    private notificationSubject = new Subject<void>();

    public notifications$ = this.notificationSubject.asObservable();

    constructor(private http: HttpClient) { }

    getNotifications(): Observable<Notification[]> {
        return this.http.get<Notification[]>(this.apiUrl, { withCredentials: true });
    }

    getUnreadCount(): Observable<number> {
        return this.http.get<number>(`${this.apiUrl}/unread-count`, { withCredentials: true });
    }

    markAsRead(id: number): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/${id}/read`, {}, { withCredentials: true });
    }

    markAllAsRead(): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/read-all`, {}, { withCredentials: true });
    }

    subscribeToNotifications(): EventSource {
        const eventSource = new EventSourcePolyfill(`${this.apiUrl}/subscribe`, {
            withCredentials: true
        });

        eventSource.addEventListener('new_notification', () => {
            console.log('New notification received from server!');
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
}
