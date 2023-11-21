import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Post } from './post.model';
import { Observable, of, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class SaveService {
  private postsCache: Post[] = [];

  constructor(private http: HttpClient) {}

  saveData(posts: Post[]): Observable<Post[]> {
    // Cache the posts
    this.postsCache = posts;

    // Send the posts to the server
    return this.http.put<Post[]>('https://firecrud-2ee77-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json', posts)
      .pipe(
        retry(3), // Retry up to 3 times in case of failure
        catchError(this.handleError) // Handle errors
      );
  }

  fetchData(): Observable<Post[]> {
    if (this.postsCache.length > 0) {
      // If the cache is not empty, return the cached posts
      return of(this.postsCache);
    } else {
      // If the cache is empty, fetch the posts from the server
      return this.http.get<Post[]>('https://firecrud-2ee77-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json')
        .pipe(
          retry(3), // Retry up to 3 times in case of failure
          catchError(this.handleError) // Handle errors
        );
    }
  }

  private handleError(error: HttpErrorResponse) {
    // Handle the error and return an Observable with a user-friendly error message
    console.error('An error occurred:', error);
    return throwError('Something went wrong. Please try again later.');
  }
}
