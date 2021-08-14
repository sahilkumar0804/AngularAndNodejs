import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http';

import {Post} from '../post';
import { Router } from '@angular/router';

@Injectable({providedIn : 'root'})
export class PostService {
  private posts : Post[] =[];
  private postsUpdate =new Subject<Post []>();


  constructor(private http: HttpClient , private router : Router){

  }
  getPosts(){
   // return [...this.posts];
    //return this.post
    this.http.get<{message :string,posts: any[]}>(
      'http://localhost:3000/api/posts'
      )
      .pipe(map(postData=>{
        return postData.posts.map(post =>{
          return {
            title : post.title,
            content :post.content,
            id:post._id,
            imagePath : post.imagePath
          }
        });
      }))
    .subscribe((transFormedPosts)=>{
      this.posts= transFormedPosts;
      this.postsUpdate.next([...this.posts]);

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
      imagePath : string
    }>("http://localhost:3000/api/posts/"+ id);
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
        imagePath: image
      }
    }
    this.http.
    put("http://localhost:3000/api/posts/"+ id, postData)
    .subscribe(response =>{
      //have no effect on my posts app
      const updatePosts =[...this.posts];
      const oldPostIndex = updatePosts.findIndex( p => p.id === id);
      const post: Post={
        id :id,
        title:title,
        content: content,
        imagePath : 'sahil'
        // imagePath: response.imagePath
      };
      updatePosts[oldPostIndex] =post;
      this.posts = updatePosts;
      this.postsUpdate.next([...this.posts]);
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
      'http://localhost:3000/api/posts',
      postData)
    .subscribe((responseData)=>{
      const post: Post ={
        id: responseData.post.id,
        title : title,
        content: content,
        imagePath: responseData.post.imagePath
      };

      this.posts.push(post);
      this.postsUpdate.next([...this.posts]); //emits new value
      this.router.navigate(["/"]);
    });
  }

  deletePost(postID : String | null){
    this.http.delete("http://localhost:3000/api/posts/"+ postID)
    .subscribe(()=>{
      const updatePosts = this.posts.filter(post=> post.id !==postID);
      this.posts =updatePosts;
      this.postsUpdate.next([...this.posts]);
    });
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
