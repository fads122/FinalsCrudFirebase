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
    return this.listofPosts.filter(post => post.userId === userId);
  }

    getPostUpdateListener(): Observable<Post[]> {
      return this.postsUpdated.asObservable();
  }

  // Method to delete a post
  async deleteButton(index: number): Promise<void> {
    const userId = await this.authService.getUserId();
    const post = this.listofPosts[index];
    if (post && post.userId === userId) {
      this.modifyPosts(() => this.listofPosts.splice(index, 1));
    } else {
      console.error(`Cannot delete post: Post at index ${index} does not exist or does not belong to the current user.`);
    }
  }

  // Method to add a post
  async addPost(post: Post): Promise<void> {
    post.userId = await this.authService.getUserId();
    this.modifyPosts(() => this.listofPosts.push(post));
}

  // Method to update a post
  async updatePost(index: number, newPost: Post): Promise<void> {
    const userId = await this.authService.getUserId();
    const post = this.listofPosts[index];
    if (post && post.userId === userId) {
      this.modifyPosts(() => this.listofPosts[index] = newPost);
    } else {
      console.error(`Cannot update post: Post at index ${index} does not exist or does not belong to the current user.`);
    }
  }



    getSpecPost(index: number){
        return this.listofPosts[index];
    }

    async likepost(index: number): Promise<void> {
      const userId = await this.authService.getUserId();
      const post = this.listofPosts[index];
      if (post && post.userId === userId) {
        this.listofPosts[index].numberoflikes++;
        this.listChangeEvent.emit(this.listofPosts);
        this.saveData();
      } else {
        console.error(`Cannot like post: Post at index ${index} does not exist or does not belong to the current user.`);
      }
    }

    async addcomment(index: number, commentText: string): Promise<void> {
      const userId = await this.authService.getUserId();
      const post = this.listofPosts[index];
      if (!post) {
        console.error(`Post at index ${index} does not exist.`);
        return;
      }
      const comment = { userId, comment: commentText };
      post.comments.push(comment);
      this.modifyPosts(() => this.listofPosts[index] = post);
    }

    setPosts(listofposts: Post[]) {
        this.listofPosts = listofposts;
        this.listChangeEvent.emit(listofposts);
        this.saveData();
    }

    searchPosts(searchTerm: string): Post[] {
      return this.listofPosts.filter(post => post.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    async deleteComment(postIndex: number, commentIndex: number): Promise<void> {
      const userId = await this.authService.getUserId();
      const post = this.listofPosts[postIndex];

      if (post && post.comments && post.userId === userId) {
        post.comments.splice(commentIndex, 1);
        this.modifyPosts(() => this.listofPosts[postIndex] = post);
      } else {
        console.error(`Cannot delete comment: Comment at index ${commentIndex} does not exist or does not belong to the current user.`);
      }
    }

    saveData(): void {
      // Format comments before saving to Firebase
      const postsWithFormattedComments = this.listofPosts.map(post => ({
        ...post,
        comments: post.comments.map(comment => ({
          userId: comment.userId,
          comment: comment.comment
        }))
      }));

      this.http.put<Post[]>('https://firecrud-2ee77-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json', postsWithFormattedComments)
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
