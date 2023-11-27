import { Component, Input, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../post-service';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

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

  constructor(private postService: PostService, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    console.log(this.post);
  }

  delete() {
    this.postService.deleteButton(this.index);
  }

  onEdit() {
    this.router.navigate(['/post-edit', this.index]);
  }

  onClick() {
    this.postService.likepost(this.index);
  }

  async deleteComment(commentIndex: number) {
    const userId = await this.authService.getUserId();
    if (this.post && this.post.userId === userId) {
      this.postService.deleteComment(this.index, commentIndex);
    } else {
      console.error('Only the author of the post can delete a comment.');
    }
  }

  async submitComment() {
    const userId = await this.authService.getUserId();
    if (this.post && this.post.userId === userId) {
      this.postService.addcomment(this.index, this.comment);
      this.comment = '';
    } else {
      console.error('Only the author of the post can add a comment.');
    }
  }
}
