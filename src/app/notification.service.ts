// notification.service.ts

import { Injectable } from '@angular/core';
import { PostService } from './post-service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private postService: PostService, private authService: AuthService) {}

  // notification.service.ts

  async getNotifications(userId: string): Promise<{ type: string, userId: string, timestamp: Date }[]> {
    console.log('Fetching notifications for user:', userId);
    const posts = await this.postService.getPost();
    const notifications = posts.flatMap(post => post.notifications || []);
    console.log('All notifications:', notifications);
    const userNotifications = notifications.filter(notification => notification.recipientId === userId);
    console.log('User notifications:', userNotifications);
    return userNotifications;
  }

}
