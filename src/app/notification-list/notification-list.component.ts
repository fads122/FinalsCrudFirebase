import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.css']
})
export class NotificationListComponent implements OnInit {
  notifications: { type: string, userId: string, timestamp: Date, postId: string, }[] = [];

  constructor(private firestore: AngularFirestore, private authService: AuthService, private router: Router) { }

  async ngOnInit() {
    const userId = await this.authService.getUserId();
    const snapshot = await this.firestore.collectionGroup('notifications', ref => ref.where('recipientId', '==', userId)).get().toPromise();
    if (snapshot) {
      this.notifications = snapshot.docs.map(doc => {
        const data = doc.data() as { type: string, userId: string, timestamp: Date, postId: string };
        return {
          type: data.type,
          userId: data.userId,
          timestamp: data.timestamp,
          postId: data.postId
        };
      });
    } else {
      console.error('Snapshot not found');
    }
  }

  goToPost(postId: string) {
    this.router.navigate(['/post', postId]);
  }
}
