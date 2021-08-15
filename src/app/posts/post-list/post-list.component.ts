import { Component, Injectable, Input, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

import {Post} from "../../post"
import { PostService } from '../post.service';


@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})


export class PostListComponent implements OnInit,OnDestroy {
  posts : Post[] =[];
  private postsSub : Subscription | undefined;
  isLoding = false ;
  totalPosts= 0;
  postsPerPage = 1;
  currentPage=1;
  pageSizeOptions =[1, 2, 3, 5];
  userIsAuthenticated =false;
  userId!: string | undefined | null;

  private authStatusSub!: Subscription;

  constructor(public postService : PostService, private authService: AuthService) {

  }

  ngOnInit(): void {
    this.postService.getPosts(this.postsPerPage, this.currentPage);
    this.isLoding = true;
    this.userId =this.authService.getUserId();
    this.postsSub=this.postService.getPostUpdateListner()
    .subscribe((postsData :{posts: Post[],postCount: number })=>{
      this.isLoding= false;
      this.posts =postsData.posts;
      this.totalPosts= postsData.postCount;
    });
    /**
     * subscribe takes 3 possible arguments
     * 1 function which is execute when ever new update in emited.
     * 2 error is emited
     * 3 observals is complicated ...
     */
    this.userIsAuthenticated =this.authService.getIsAuth();
    this.authStatusSub=this.authService.getAuthStatusListner()
    .subscribe(isAuthenticated =>{
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
    });
  }

  onChangedPage(pageData: PageEvent){
    this.isLoding= true;
    this.currentPage =pageData.pageIndex +1;
    this.postsPerPage =pageData.pageSize;
    this.postService.getPosts(this.postsPerPage, this.currentPage);

  }


  ngOnDestroy(){
      this.postsSub?.unsubscribe();
      this.authStatusSub.unsubscribe();
  }

  onDelete(post :Post ){
    this.isLoding = true;
    this.postService.deletePost(post.id)
    .subscribe(()=>{
      this.postService.getPosts(this.postsPerPage, this.currentPage)
    });

  }

  // posts =[
  //   { title: "1" , content : "this is first" },
  //   { title: "2" , content : "this is second" },
  //   { title: "3" , content : "this is third" },

  // ];

  //@Input() posts :Post[] =[];


}
