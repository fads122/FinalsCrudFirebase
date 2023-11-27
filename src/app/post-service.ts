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
  deleteButton(index: number): void {
      this.modifyPosts(() => this.listofPosts.splice(index, 1));
  }

  // Method to add a post
  async addPost(post: Post): Promise<void> {
    post.userId = await this.authService.getUserId();
    this.modifyPosts(() => this.listofPosts.push(post));
}

  // Method to update a post
  updatePost(index: number, post: Post): void {
      this.modifyPosts(() => this.listofPosts[index] = post);
  }



    getSpecPost(index: number){
        return this.listofPosts[index];
    }

      likepost(index: number){
          this.listofPosts[index].numberoflikes++;
          this.listChangeEvent.emit(this.listofPosts);
          this.saveData();
      }

      addcomment(index: number, comment: string, userId: string){
        if (this.listofPosts[index] && this.listofPosts[index].comments) {
          this.listofPosts[index].comments.push({ userId, comment });
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

    getPostById(id: string): Post | undefined {
      return this.listofPosts.find(post => post.id === id);
    }

    searchPosts(searchTerm: string): Post[] {
      return this.listofPosts.filter(post => post.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    deleteComment(postIndex: number, commentIndex: number) {
      if (this.listofPosts[postIndex] && this.listofPosts[postIndex].comments) {
          this.listofPosts[postIndex].comments.splice(commentIndex, 1);
          this.listChangeEvent.emit(this.listofPosts);
          this.saveData();
      } else {
          console.error(`Cannot delete comment: Post at index ${postIndex} or its comments property is undefined`);
      }
  }

    saveData(): void {
      this.http.put<Post[]>('https://firecrud-2ee77-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json', this.listofPosts)
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
