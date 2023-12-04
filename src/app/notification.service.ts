import { Injectable } from '@angular/core';
import { PostService } from './post-service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private postService: PostService, private authService: AuthService) {}

  async getNotifications(userId: string): Promise<{ type: string, userId: string, recipientId: string, timestamp: Date }[]> {
    const posts = await this.postService.getPost();
    const notifications = posts.flatMap(post => post.notifications || []);
    console.log('All notifications:', notifications); // Add this line
    const userNotifications = notifications.filter(notification => notification.recipientId === userId);
    console.log('User notifications:', userNotifications); // Add this line
    return userNotifications;
  }
}
