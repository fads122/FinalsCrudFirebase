import { Injectable } from '@angular/core';
import { PostService } from './post-service';
import { Post } from './post.model';
import { tap } from 'rxjs/operators'; // Import the tap operator
import { from } from 'rxjs';


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
      tap((data: any) => {
        const listOfPosts: Post[] = [];
        for (const userId in data) {
          if (data[userId].posts) {
            listOfPosts.push(...Object.values(data[userId].posts) as Post[]);
          }
        }
        this.postService.setPosts(listOfPosts);
      })
    ).subscribe();
  }

  

  private ensurePostHasCommentsArrayAndDateObject(post: Post) {
    if (!Array.isArray(post.comments)) {
      post.comments = [];
    }
  }
}
