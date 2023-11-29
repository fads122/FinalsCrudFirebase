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

  constructor(private postService: PostService, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    console.log(this.post);
  }

  delete() {
    this.postService.deleteButton(this.index.toString());
  }

  onEdit() {
    this.router.navigate(['/post-edit', this.index]);
  }

  onClick() {
    if (this.post && this.post.userId) {
      this.postService.likepost(this.post.userId, this.index);
    }
  }

  deleteComment(commentIndex: number) {
    this.postService.deleteComment(this.index, commentIndex);
}

async submitComment() {
  if (this.post && this.post.userId && this.comment) {
    const userId = await this.authService.getUserId();
    this.postService.addcomment(this.comment, userId, this.index);
    this.comment = '';
  }
}

}
