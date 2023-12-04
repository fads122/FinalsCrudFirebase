// notification-list.component.ts

import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../notification.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.css']
})
export class NotificationListComponent implements OnInit {
  notifications: { type: string, userId: string, timestamp: Date }[] = [];

  constructor(private notificationService: NotificationService, private authService: AuthService) {}

  // notification-list.component.ts

  async ngOnInit(): Promise<void> {
    try {
      const userId = await this.authService.getUserId();
      console.log('Fetching notifications for user:', userId);

      // Ensure that this is awaited
      this.notifications = await this.notificationService.getNotifications(userId);

      console.log('Notifications in component:', this.notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }

}
