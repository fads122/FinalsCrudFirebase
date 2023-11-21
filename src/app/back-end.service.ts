import { Injectable } from '@angular/core';
import { PostService } from './post-service';
import { Post } from './post.model';
import { tap } from 'rxjs/operators'; // Import the tap operator

@Injectable({
  providedIn: 'root'
})
export class BackEndService {
  constructor(private postService: PostService) { }

  saveData() {
    this.postService.saveData(); // No arguments needed
  }

  fetchData() {
    this.postService.fetchData().pipe(
      tap((listOfPost: Post[]) => {
        listOfPost.forEach(post => this.ensurePostHasCommentsArrayAndDateObject(post));
        this.postService.setPosts(listOfPost);
      })
    ).subscribe();
  }

  private ensurePostHasCommentsArrayAndDateObject(post: Post) {
    if (!Array.isArray(post.comments)) {
      post.comments = [];
    }
    post.dateCreated = new Date(post.dateCreated);
  }
}
