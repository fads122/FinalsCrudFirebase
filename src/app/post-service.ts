import { EventEmitter, Injectable } from "@angular/core";
import { Post } from "./post.model";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Subject, Observable } from "rxjs";
import { retry } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { BehaviorSubject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

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
  post.id = uuidv4(); // Add this line
  post.userId = await this.authService.getUserId();
  this.modifyPosts(() => this.listofPosts.push(post));
}

  // Method to update a post
  updatePost(userId: string, newPost: Post): void {
    const index = this.listofPosts.findIndex(post => post && post.userId === userId);
    if (index !== -1) {
      this.modifyPosts(() => this.listofPosts[index] = newPost);
    }
  }

    getSpecPost(index: number){
        return this.listofPosts[index];
    }

    likepost(userId: string, postId: string){
      console.log('Before liking/unliking post:', this.listofPosts); // Add this line
      const post = this.listofPosts.find(post => post && post.id === postId);
      if (post) {
        if (!post.likes.includes(userId)) {
          post.likes.push(userId);
          post.numberoflikes++;
        } else {
          const index = post.likes.indexOf(userId);
          post.likes.splice(index, 1);
          post.numberoflikes--;
        }
        console.log('After liking/unliking post:', this.listofPosts); // Add this line
        this.listChangeEvent.emit(this.listofPosts);
        this.saveData();
      } else {
        console.error(`Cannot like post: No post found with ID ${postId}`);
      }
    }

    async addcomment(comment: string, commentUserId: string, postId: string) {
      console.log('Adding comment to post with ID:', postId);
      console.log('Current posts:', this.listofPosts.filter(post => post).map(post => post.id));
      const post = this.listofPosts.find(post => post && post.id === postId);
      const email = await this.authService.getUserEmail();
      const timestamp = new Date();
      if (post) {
        if (!Array.isArray(post.comments)) {
          post.comments = [];
        }
        post.comments.unshift({ userId: commentUserId, email, comment, timestamp });
        this.listChangeEvent.emit(this.listofPosts);
        this.saveData();
      } else {
        console.error(`Cannot add comment: Post with ID ${postId} is undefined`);
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

    async deleteComment(postId: string, commentIndex: number) {
      const post = this.listofPosts.find(post => post && post.id === postId);
      if (post && Array.isArray(post.comments)) {
        if (commentIndex !== -1 && commentIndex < post.comments.length) {
          post.comments.splice(commentIndex, 1);
          if (post.comments.length === 0) {
            post.comments = [];
          }
          this.listChangeEvent.emit(this.listofPosts);
          this.saveData();
        } else {
          console.error(`Cannot delete comment: No comment found at index ${commentIndex}`);
        }
      } else {
        console.error(`Cannot delete comment: Post with ID ${postId} is undefined`);
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
