import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import {Post} from '../post';
import { Router } from '@angular/router';

const BACKEND_URL=environment.apiUrl+"/posts/";

@Injectable({providedIn : 'root'})
export class PostService {
  private posts : Post[] =[];
  private postsUpdate =new Subject<{posts :Post [] ,postCount : number}>();



  constructor(private http: HttpClient , private router : Router){

  }
  getPosts(postPerPage : number, currentPage: number){
    const queryParams ="?pageSize="+ postPerPage +"&page="+currentPage;
    this.http.get<{message :string,posts: any[], maxPosts: number}>(
      BACKEND_URL + queryParams
      )
      .pipe(map(postData=>{
        return {
          posts : postData.posts.map(post =>{
            return {
              title : post.title,
              content :post.content,
               id:post._id,
              imagePath : post.imagePath,
              creator: post.creator
            }
        }),
        maxPosts: postData.maxPosts
      }
      }))
    .subscribe((transFormedPosts)=>{
      this.posts= transFormedPosts.posts;
      this.postsUpdate.next({
        posts: [...this.posts] ,
        postCount :transFormedPosts.maxPosts
      });

    });
  }

  getPostUpdateListner(){
    return this.postsUpdate.asObservable();
  }

  getPost(id: string | null){
    return this.http.get<{
      _id: string,
      title : string,
      content : string,
      imagePath : string,
      creator: string
    }>(BACKEND_URL+ id);
  }

  updatePost(id : string , title :string ,content :string, image : File | string){
    let postData: Post | FormData ;
    if(typeof(image) === 'object'){
      postData =new FormData();
      postData.append("id" , id);
      postData.append('title' , title);
      postData.append('content' , content);
      postData.append('image' ,image ,title);
    }else{
        postData ={
        id :id,
        title:title,
        content: content,
        imagePath: image,
        creator: null
      }
    }
    this.http.
    put(BACKEND_URL+ id, postData)
    .subscribe(response =>{

      this.router.navigate(["/"]);
    });
  }

  addPost(title: string ,content : string ,image : File){
    //const post : Post ={id : 'sss', title :title , content : content};
    const postData = new FormData()
    postData.append('title' , title);
    postData.append('content' , content);
    postData.append('image' ,image, title);

    this.http.post<{message :String, post: Post}>(
      BACKEND_URL,
      postData)
    .subscribe((responseData)=>{
      this.router.navigate(["/"]);
    });
  }

  deletePost(postID : String | null){
    return this.http.delete(BACKEND_URL+ postID);

  }
}


//tsRmQHpebQCkWR1S
//angularapp
/**
 * const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://angularapp:<password>@cluster0.cs0jl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});
 */
