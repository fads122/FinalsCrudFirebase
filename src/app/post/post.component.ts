import { Component, Input, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../post-service';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Auth } from '@firebase/auth';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  memberName = "Chan";
  comment: string = '';
  @Input() index: number = 0;
  @Input() post?: Post;
  currentUserId: string = '';

  constructor(private postService: PostService, private router: Router, private authService: AuthService) { }

  async ngOnInit(): Promise<void> {
    this.currentUserId = await this.authService.getUserId();
    console.log(this.post);
  }

  async delete() {
    const userId = await this.authService.getUserId();
    if (this.post?.userId === userId) {
      this.postService.deleteButton(userId);
    }
  }

  async onEdit() {
    const userId = await this.authService.getUserId();
    if (this.post?.userId === userId) {
      this.router.navigate(['/post-edit', this.index]);
    }
  }

  async onClick() {
    const userId = await this.authService.getUserId();
    if (this.post?.userId !== userId) {
      const likes = this.post?.likes || [];
      if (likes.includes(userId)) {
        // User has already liked this post, so unlike it
        const index = likes.indexOf(userId);
        likes.splice(index, 1);
        if (this.post) {
          this.post.numberoflikes--;
        }
      } else {
        // User has not liked this post yet, so like it
        likes.push(userId);
        if (this.post) {
          this.post.numberoflikes++;
        }
      }
      if (this.post) {
        this.post.likes = likes; // Update the likes array of the post
        this.postService.updatePost(this.post.userId, this.post);
      }
    }
  }

  async deleteComment(commentIndex: number) {
    const userId = await this.authService.getUserId();
    if (this.post?.comments[commentIndex].userId === userId) {
      this.postService.deleteComment(this.post.id, commentIndex);
    }
  }

async submitComment() {
  if (this.post && this.post.userId && this.comment) {
    const userId = await this.authService.getUserId();
    this.postService.addcomment(this.comment, userId, this.post.id);
    this.comment = '';
  }
}

}
