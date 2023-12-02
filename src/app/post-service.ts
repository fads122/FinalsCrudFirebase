import { EventEmitter, Injectable } from "@angular/core";
import { Post } from "./post.model";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Subject, Observable } from "rxjs";
import { retry } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

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
  this.listofPosts.push(post);
  this.postsUpdated.next([...this.listofPosts]);
  this.saveData();
}

  // Method to update a post
  updatePost(userId: string, newPost: Post): void {
    const index = this.listofPosts.findIndex(post => post.userId === userId && post.id === newPost.id);
    if (index !== -1) {
      this.listofPosts[index] = newPost;
      this.postsUpdated.next([...this.listofPosts]);
      this.saveData();
    }
  }

    getSpecPost(index: number){
        return this.listofPosts[index];
    }

    likepost(userId: string, index: number){
      console.log('userId:', userId); // Log the userId
      console.log('index:', index); // Log the index

      const userPosts = this.listofPosts.filter(post => post.userId === userId);
      console.log('userPosts:', userPosts); // Log the userPosts array

      const post = userPosts[index];
      console.log('post:', post); // Log the post

      if (post) {
        post.numberoflikes++;
        this.listChangeEvent.emit(this.listofPosts);
        this.saveData();
      } else {
        console.error(`Cannot like post: No post found with ID ${userId}`);
      }

      console.log('listofPosts:', this.listofPosts); // Log the listofPosts array
    }

    async addcomment(comment: string, commentUserId: string, postId: string) {
      console.log('postId:', postId); // Log the postId
      console.log('listofPosts:', this.listofPosts); // Log the listofPosts array

      const validPosts = this.listofPosts.filter(post => post !== null);
      console.log('validPosts:', validPosts); // Log the validPosts array

      const post = validPosts.find(p => p.id === postId);
      const email = await this.authService.getUserEmail();
      const timestamp = new Date();
      if (post && Array.isArray(post.comments)) {
        post.comments.unshift({ userId: commentUserId, email, comment, timestamp });
        this.listChangeEvent.emit(this.listofPosts);
        this.saveData();
      } else {
        console.error(`Cannot add comment: Post with id ${postId} or its comments property is undefined`);
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
      console.log('postIndex:', postIndex); // Log the postIndex
      console.log('commentIndex:', commentIndex); // Log the commentIndex

      const currentUserId = await this.authService.getUserId();
      console.log('currentUserId:', currentUserId); // Log the currentUserId

      const validPosts = this.listofPosts.filter(post => post !== null);
      const post = validPosts[postIndex];
      console.log('post:', post); // Log the post

      if (post && Array.isArray(post.comments) && post.comments[commentIndex].userId === currentUserId) {
        post.comments.splice(commentIndex, 1);
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


    fetchData() {
      return this.http.get<{ [key: string]: Post }>('https://firecrud-2ee77-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json')
        .pipe(
          map((postData: { [key: string]: Post }) => {
            const postsArray: Post[] = [];
            for (const key in postData) {
              if (postData.hasOwnProperty(key)) {
                postsArray.push({ ...postData[key], id: key });
              }
            }
            return postsArray;
          }),
          tap((postsArray: Post[]) => {
            // Sort the posts by their id
            postsArray.sort((a: Post, b: Post) => a.id.localeCompare(b.id));
            this.setPosts(postsArray);
          })
        );
    }

private modifyPosts(modification: () => void): void {
  modification();
  this.postsUpdated.next([...this.listofPosts]);
  this.saveData();
}
}
