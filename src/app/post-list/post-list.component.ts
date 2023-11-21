import { Component, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../post-service';
import { BackEndService } from '../back-end.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
  index=0
  listofPosts: Post[] = [];

  constructor(
    private postService: PostService, private backEndService: BackEndService
  ){}


  ngOnInit(): void {
    this.postService.getPost().then((posts: Post[]) => {
        this.listofPosts = posts;
        this.postService.listChangeEvent.subscribe((post:Post[]) => {
            this.listofPosts = post;
        })
    });
}
}
