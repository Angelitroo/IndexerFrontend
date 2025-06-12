export interface Notification {
  id: number;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}
