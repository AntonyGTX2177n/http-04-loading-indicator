import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Post } from './post.model';
import { map, catchError } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostServiceService {
   error = new Subject<string>();

  constructor(private http: HttpClient) { }

  creatAnStorePost(title: string, content: string) {
    const  postData: Post = { title:  title, content: content};
    this.http
      .post<{ name: string }>(
        'https://firstproject-8b6f6-default-rtdb.firebaseio.com/posts.json',
        postData
       )
      .subscribe(responseData => {
        console.log(responseData);
      }, error => {
        this.error.next(error.message);
      });
  }

  fetchPost() {
    return this.http
    .get<{ [key: string]: Post }>(
    'https://firstproject-8b6f6-default-rtdb.firebaseio.com/posts.json',
    {
      headers: new HttpHeaders({
        "CustomHeaders": "Hello"
      }),
      params: new HttpParams().set('print', 'pretty') 
    }
    )
    .pipe(
      map(responseData => {
        const postsArray: Post[] = [];
        for (const key in responseData) {
          if (responseData.hasOwnProperty(key)) {
           postsArray.push({ ...responseData[key], id: key });
          }
        }
        return postsArray;
      }),
      catchError(errorResponse => {
        return throwError(errorResponse);
      })
    );
   }

  deletePost() {
    return this.http.delete('https://firstproject-8b6f6-default-rtdb.firebaseio.com/posts.json');
  } 
}
