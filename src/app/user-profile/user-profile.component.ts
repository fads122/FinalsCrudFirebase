import { Component, OnInit } from '@angular/core';
import { PostService } from '../post-service';
import { AuthService } from '../auth.service';
import { Post } from '../post.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  posts: Post[] = [];
  comment: string = '';

  constructor(private postService: PostService, private authService: AuthService, private router: Router) { }

  async ngOnInit() {
    await this.postService.fetchData().toPromise(); // Fetch the posts from the backend
    const userId = await this.authService.getUserId();
    this.posts = this.postService.getPostsByUserId(userId);
  }


  async onEdit(postId: string) {
    // Navigate to the post edit page
    this.router.navigate(['/post-edit', postId]);
  }



  async onClick(postId: string) {
    const userId = await this.authService.getUserId();
    this.postService.likepost(userId, postId);
  }



  async deleteComment(postId: string, commentIndex: number) {
    const userId = await this.authService.getUserId();
    this.postService.deleteComment(postId, commentIndex);
  }

  async submitComment(comment: string, postId: string) {
    const userId = await this.authService.getUserId();
    this.postService.addcomment(comment, userId, postId);
    this.comment = '';
  }

  async deletePost(postId: string){
    const userId = await this.authService.getUserId();
    const index = this.postService.listofPosts.findIndex(post => post && post.id === postId && post.userId === userId);
    if (index !== -1) {
      this.postService.listofPosts.splice(index, 1);
      this.postService.listChangeEvent.emit(this.postService.listofPosts);
      this.postService.saveData();
    }
  }
}
