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

  async ngOnInit(): Promise<void> {
    const userId = await this.authService.getUserId(); // get the user id
    this.notifications = await this.notificationService.getNotifications(userId);
    console.log('Notifications in component:', this.notifications); // Add this line
  }
}