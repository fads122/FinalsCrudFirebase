import { Component, OnInit } from '@angular/core';
import { PostService } from '../post-service';
import { AuthService } from '../auth.service';
import { Post } from '../post.model';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  posts: Post[] = [];

  constructor(private postService: PostService, private authService: AuthService) { }

  async ngOnInit() {
    const userId = await this.authService.getUserId();
    this.posts = await this.postService.getPostsByUserId(userId);
  }
}
