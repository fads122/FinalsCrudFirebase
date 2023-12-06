import { Component, OnInit } from '@angular/core';
import { PostService } from '../post-service';
import { AuthService } from '../auth.service';
import { Post } from '../post.model';
import { Router } from '@angular/router';
import { UserService } from '../user.service'; // adjust the path according to your project structure
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  posts: Post[] = [];
  comment: string = '';
  users: any[] = [];

  constructor(private postService: PostService, private authService: AuthService, private router: Router, private userService: UserService) { }

  async ngOnInit() {
    const posts = await firstValueFrom(this.postService.fetchData());
    const userId = await this.authService.getUserId();
    this.posts = this.postService.getPostsByUserId(userId);
    this.users = await this.userService.getUsers();
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
