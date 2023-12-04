// notification.component.ts

import { Component, Input, OnInit } from '@angular/core';
import { Post } from '../post.model';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  @Input() notification: { type: string, userId: string, timestamp: Date } = { type: '', userId: '', timestamp: new Date() };
  @Input() post: Post = new Post('', '', '', '', '', '', new Date(), 0, [], [], '');

  constructor() { }

  ngOnInit(): void {
  }
}
