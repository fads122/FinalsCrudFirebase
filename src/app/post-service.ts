import { EventEmitter, Injectable } from "@angular/core";
import { Post } from "./post.model";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Subject, Observable } from "rxjs";
import { retry } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class PostService{
    listChangeEvent: EventEmitter<Post[]> = new EventEmitter();
    listofPosts: Post[] = []
    private postsUpdated = new Subject<Post[]>();
    private postsCache: Post[] = [];
    private searchTerm = new BehaviorSubject<string>('');
    private postDeleted = new Subject<void>();

    constructor(private http: HttpClient, private authService: AuthService) { }



    async getPost(): Promise<Post[]> {
      const userId = await this.authService.getUserId();
      const posts = this.listofPosts.filter(post => post && post.userId !== userId); // Add this line
      posts.forEach(post => {
        if (!Array.isArray(post.comments)) {
          post.comments = [];
        }
      });
      return posts;
    }

    getPostUpdateListener(): Observable<Post[]> {
      return this.postsUpdated.asObservable();
  }

  setSearchTerm(term: string) {
    console.log('Search term updated:', term); // Add this line
    this.searchTerm.next(term);
  }

  getSearchTerm() {
    return this.searchTerm.asObservable();
  }


  // Method to delete a post
  deleteButton(userId: string): void {
    const index = this.listofPosts.findIndex(post => post.userId === userId);
    this.modifyPosts(() => this.listofPosts.splice(index, 1));
    this.postDeleted.next();
  }

  getPostDeletedListener(): Observable<void> {
    return this.postDeleted.asObservable();
  }

 // Method to add a post
async addPost(post: Post): Promise<void> {
  post.userId = await this.authService.getUserId();
  this.modifyPosts(() => this.listofPosts.push(post));
}

  // Method to update a post
  updatePost(userId: string, newPost: Post): void {
    const index = this.listofPosts.findIndex(post => post.userId === userId);
    if (index !== -1) {
      this.modifyPosts(() => this.listofPosts[index] = newPost);
    }
  }

    getSpecPost(index: number){
        return this.listofPosts[index];
    }

    likepost(userId: string, index: number){
      const userPosts = this.listofPosts.filter(post => post.userId === userId);
      const post = userPosts[index];
      if (post) {
        post.numberoflikes++;
        this.listChangeEvent.emit(this.listofPosts);
        this.saveData();
      } else {
        console.error(`Cannot like post: No post found with ID ${userId}`);
      }
    }

    async addcomment(comment: string, commentUserId: string, index: number) {
      const post = this.listofPosts[index];
      const email = await this.authService.getUserEmail();
      const timestamp = new Date();
      if (post && Array.isArray(post.comments)) {
        post.comments.unshift({ userId: commentUserId, email, comment, timestamp }); // Use unshift instead of push
        this.listChangeEvent.emit(this.listofPosts);
        this.saveData();
      } else {
        console.error(`Cannot add comment: Post at index ${index} or its comments property is undefined`);
      }
    }

    setPosts(listofposts: Post[]) {
        this.listofPosts = listofposts;
        this.listChangeEvent.emit(listofposts);
        this.saveData();
    }

    getPostsByUserId(userId: string): Post[] {
      return this.listofPosts.filter(post => post.userId === userId);
    }

    searchPosts(searchTerm: string): Post[] {
      return this.listofPosts.filter(post => post.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    async deleteComment(postIndex: number, commentIndex: number) {
      const userId = await this.authService.getUserId();
      const post = this.listofPosts[postIndex];
      if (post && Array.isArray(post.comments) && post.comments[commentIndex].userId === userId) {
        post.comments.splice(commentIndex, 1);
        if (post.comments.length === 0) {
          post.comments = [];
        }
        this.listChangeEvent.emit(this.listofPosts);
        this.saveData();
      } else {
        console.error(`Cannot delete comment: Comment at index ${commentIndex} does not belong to current user or its post at index ${postIndex} is undefined`);
      }
    }

    saveData(): void {
      const postsData = this.listofPosts.reduce((acc, post) => {
        if (post && post.userId) { // Add this line
          if (!acc[post.userId]) {
            acc[post.userId] = { posts: {} };
          }
          acc[post.userId].posts[this.listofPosts.indexOf(post)] = post;
        }
        return acc;
      }, {} as { [userId: string]: { posts: { [index: number]: Post } } });

      this.http.put('https://firecrud-2ee77-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json', postsData)
        .pipe(retry(3))
        .subscribe({
          next: () => console.log('Data saved successfully'),
          error: err => console.error('Error in saveData', err)
        });
    }


  fetchData(): Observable<Post[]> {
    return this.http.get<Post[]>('https://firecrud-2ee77-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json')
        .pipe(retry(3));
}

private modifyPosts(modification: () => void): void {
  modification();
  this.postsUpdated.next([...this.listofPosts]);
  this.saveData();
}
}
