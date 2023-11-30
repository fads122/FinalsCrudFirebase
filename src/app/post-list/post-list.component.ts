import { Component, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../post-service';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { BackEndService } from '../back-end.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
  posts: Post[] = [];
  filteredPosts: Post[] = [];
  searchTerm: string = '';
  authSub: Subscription;

  constructor(private postService: PostService, private authService: AuthService, private backEndService: BackEndService) {
    this.authSub = new Subscription();
  }

  ngOnInit(): void {
    this.authSub = this.authService.getAuthState().subscribe(user => {
      if (user) {
        this.fetchPosts();
      }
    });
    this.postService.getPostUpdateListener().subscribe((posts: Post[]) => {
      this.posts = posts;
      this.filteredPosts = [...posts];
    });
    this.postService.getSearchTerm().subscribe(searchTerm => {
      this.searchTerm = searchTerm;
      this.onSearch();
    });
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }

  async fetchPosts() {
    await this.backEndService.fetchData();
    this.posts = await this.postService.getPost();
    this.filteredPosts = [...this.posts];
  }

  async onSearch(): Promise<void> {
    const userId = await this.authService.getUserId();
    this.filteredPosts = this.posts.filter(post => {
      const matchesTitle = post.title.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesDescription = post.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      const isUserPost = post.userId === userId;
      return (matchesTitle || matchesDescription) && isUserPost;
    });
  }
}
