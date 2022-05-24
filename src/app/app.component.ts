import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Subscription} from 'rxjs';

import { Post } from './post.model';
import { PostServiceService } from './post-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  loadedPosts: Post[] = [];
  isFetching = false;
  error = null;
  errorLog = new Subscription;

  constructor(private http: HttpClient, private  postService: PostServiceService) {}

  ngOnInit() {
    this.errorLog = this.postService.error.subscribe(errorMessage => {
      this.error = errorMessage;
    })

    this.isFetching = true;
    this.postService.fetchPost().subscribe(posts => {
      this.isFetching = false;
      this.loadedPosts = posts;
    }, error => {
      this.isFetching = false;
      this.error = error.message;
    });
  }

  onCreatePost(postData: Post) {
    // Send Http request
    this.postService.creatAnStorePost(postData.title, postData.content);
  }

  onFetchPosts() {
    // Send Http request
    this.isFetching = true;
    this.postService.fetchPost().subscribe(posts => {
      this.isFetching = false;
      this.loadedPosts = posts;
    }, error => {
      this.isFetching = false;
      this.error = error.message;
      console.log(error);
    });
  }

  onClearPosts() {
    // Send Http request
    this.postService.deletePost().subscribe(() => {
      this.loadedPosts = [];
    }, error => {
        this.error = error.message;
        console.log(error);
    });
  }
  onHandleError() {
    this.error = null;
  }

 ngOnDestroy() {
   this.errorLog.unsubscribe();
 }

 
}
