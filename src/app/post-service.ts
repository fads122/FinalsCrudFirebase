import { EventEmitter, Injectable } from "@angular/core";
import { Post } from "./post.model";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Subject, Observable } from "rxjs";
import { retry } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({providedIn: 'root'})
export class PostService{
    listChangeEvent: EventEmitter<Post[]> = new EventEmitter();
    listofPosts: Post[] = []
    private postsUpdated = new Subject<Post[]>();
    private postsCache: Post[] = [];

    constructor(private http: HttpClient, private authService: AuthService) { }



    async getPost(): Promise<Post[]> {
      const userId = await this.authService.getUserId();
      const posts = this.listofPosts.filter(post => post.userId === userId);
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

  // Method to delete a post
  deleteButton(userId: string): void {
    const index = this.listofPosts.findIndex(post => post.userId === userId);
    this.modifyPosts(() => this.listofPosts.splice(index, 1));
    this.postsUpdated.next([...this.listofPosts]);
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

    addcomment(comment: string, commentUserId: string, index: number){
      const post = this.listofPosts[index];
      if (post && Array.isArray(post.comments)) {
        post.comments.push({ userId: commentUserId, comment });
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

    getPostById(userId: string, index: number): Post | undefined {
      const userPosts = this.listofPosts.filter(post => post.userId === userId);
      return userPosts[index];
    }

    searchPosts(searchTerm: string): Post[] {
      return this.listofPosts.filter(post => post.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    deleteComment(postIndex: number, commentIndex: number) {
      if (this.listofPosts[postIndex] && this.listofPosts[postIndex].comments) {
        this.listofPosts[postIndex].comments.splice(commentIndex, 1);
        if (this.listofPosts[postIndex].comments.length === 0) {
          this.listofPosts[postIndex].comments = [];
        }
        this.listChangeEvent.emit(this.listofPosts);
        this.saveData();
      } else {
        console.error(`Cannot delete comment: Post at index ${postIndex} or its comments property is undefined`);
      }
    }

  saveData(): void {
    const postsData = this.listofPosts.reduce((acc, post) => {
      if (!acc[post.userId]) {
        acc[post.userId] = { posts: {} };
      }
      acc[post.userId].posts[this.listofPosts.indexOf(post)] = post;
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
