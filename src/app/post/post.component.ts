import { Component, Input, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../post-service';
import { Router } from '@angular/router';

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

  constructor(private postService: PostService, private router: Router) { }

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

  deleteComment(commentIndex: number) {
    this.postService.deleteComment(this.index, commentIndex);
}

  submitComment() {
    if (this.comment) {
      this.postService.addcomment(this.index, this.comment); // Pass the post object and the new comment
      this.comment = ''; // Clear the comment input field after adding the comment
    }
  }
}
