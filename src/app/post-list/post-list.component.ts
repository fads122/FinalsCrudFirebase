import { Component, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../post-service';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
  posts: Post[] = [];
  private authSub!: Subscription;

  constructor(private postService: PostService, private authService: AuthService) {}

  ngOnInit(): void {
    this.authSub = this.authService.getAuthState().subscribe(user => {
      if (user) {
        this.fetchPosts();
      }
    });
    this.postService.getPostUpdateListener().subscribe((posts: Post[]) => {
      this.posts = posts;
    });
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }

  async fetchPosts() {
    this.posts = await this.postService.getPost();
  }
}
