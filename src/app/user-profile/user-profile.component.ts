import { Component, OnInit } from '@angular/core';
import { PostService } from '../post-service';
import { AuthService } from '../auth.service';
import { Post } from '../post.model';
import { Router } from '@angular/router';
import { UserService } from '../user.service'; // adjust the path according to your project structure
import { firstValueFrom } from 'rxjs';
import { ImageService } from '../image.service'; // adjust the path according to your project structure

interface UserData {
  savedPosts?: string[];
  profileImageUrl?: string;
  coverImageUrl?: string;
}

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  posts: Post[] = [];
  comments: { [postId: string]: string } = {};
  users: any[] = [];
  savedPosts: Post[] = [];
  profileImageUrl: string = '';
  coverImageUrl: string = '';

  constructor(private postService: PostService, private authService: AuthService, private router: Router, private userService: UserService, private imageService: ImageService) { }

  async ngOnInit() {
    await this.fetchPosts();
  }

  async fetchPosts() {
    const userId = await this.authService.getUserId();
    if (userId) {
      const userDoc = await this.userService.getUserDoc(userId);
      if (userDoc?.exists) {
        let userData = userDoc.data() as UserData;
        if (userData) {
          if (userData.savedPosts) {
            this.savedPosts = userData.savedPosts.map(postId => {
              if (postId) {
                return this.postService.getPostById(postId);
              } else {
                return undefined;
              }
            }).filter(post => post !== undefined) as Post[];
          }
          this.profileImageUrl = userData.profileImageUrl || '';
          this.coverImageUrl = userData.coverImageUrl || '';
        }
      }
      this.posts = this.postService.getPostsByUserId(userId);
      this.posts.forEach(post => this.comments[post.id] = '');
    }
  }


  async onProfileImageSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.profileImageUrl = await this.imageService.uploadImage(file, 'profile_images');
      await this.userService.updateUserProfileImage(this.profileImageUrl);
    }
  }

  async onCoverImageSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.coverImageUrl = await this.imageService.uploadImage(file, 'cover_images');
      await this.userService.updateUserCoverImage(this.coverImageUrl);
    }
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

  async submitComment(postId: string) {
    const userId = await this.authService.getUserId();
    this.postService.addcomment(this.comments[postId], userId, postId); // Modify this line
    this.comments[postId] = ''; // Modify this line
  }

  async deletePost(postId: string){
    const userId = await this.authService.getUserId();
    const index = this.postService.listofPosts.findIndex(post => post && post.id === postId && post.userId === userId);
    if (index !== -1) {
      this.postService.listofPosts.splice(index, 1);
      this.postService.listChangeEvent.emit(this.postService.listofPosts);
      this.postService.saveData();
      await this.fetchPosts(); // Fetch the posts again after a post is deleted
    }
  }

  
}
