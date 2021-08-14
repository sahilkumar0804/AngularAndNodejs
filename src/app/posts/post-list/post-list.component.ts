import { Component, Injectable, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

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


  constructor(public postService : PostService) {

  }

  ngOnInit(): void {
    this.postService.getPosts();
    this.isLoding = true;
    this.postsSub=this.postService.getPostUpdateListner().subscribe((posts : Post[])=>{
      this.isLoding= false;
      this.posts =posts;
    });
    /**
     * subscribe takes 3 possible arguments
     * 1 function which is execute when ever new update in emited.
     * 2 error is emited
     * 3 observals is complicated ...
     */
  }

  ngOnDestroy(){
      this.postsSub?.unsubscribe();
  }

  onDelete(post :Post ){
    this.postService.deletePost(post.id);

  }

  // posts =[
  //   { title: "1" , content : "this is first" },
  //   { title: "2" , content : "this is second" },
  //   { title: "3" , content : "this is third" },

  // ];

  //@Input() posts :Post[] =[];


}
