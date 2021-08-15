import { Component, OnInit , EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup , Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { Post } from '../../post';
import { PostService } from '../post.service';
import  { mimeType } from './mime-type-validator'

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  private mode = 'create';
  private postId!:string;
  post! : Post;
  isLoding = false;
  form!:FormGroup;
  imagePreview!: string | ArrayBuffer | null;
  constructor(public postService : PostService, public route :ActivatedRoute) { }

  ngOnInit(): void {
    this.form =new FormGroup({
      'title': new FormControl(null,{
          validators : [ Validators.required , Validators.minLength(3) ]
        }),
        'content': new FormControl(null ,{
          validators :[Validators.required]
        }),
        'image' : new FormControl(null,
          {
            validators:[Validators.required],
            asyncValidators : [ mimeType ]
          })
    });
    this.route.paramMap.subscribe((paramMap : ParamMap)=>{
        if(paramMap.has('postId')){
          this.mode ='edit';
          this.postId = (paramMap.get('postId') as string);
          this.isLoding =true;
          this.postService.getPost(this.postId)
          .subscribe(postData =>{
            this.isLoding = false;
            this.post = <Post>{
              id : postData._id,
              title : postData.title,
              content : postData.content,
              imagePath: postData.imagePath,
              creator: postData.creator
            }
            this.form.setValue({
              'title':this.post.title,
              'content': this.post.content,
              'image': this.post.imagePath
            });

          });
        } else {
          this.mode = 'create';
        }

    });
  }

  // enteredTitle ='';
  // enteredContent ='';
  //@Output() postCreated = new EventEmitter<Post>();

  onSavePost(){
    if(this.form.invalid){
      return;
    }

    this.isLoding= true;
    if(this.mode === 'create'){
    this.postService.addPost(this.form.value.title,this.form.value.content , this.form.value.image);

    } else {
      this.postService.updatePost(
        this.postId,
         this.form.value.title,
        this.form.value.content,
        this.form.value.image
         );
    }
    this.form.reset();
  }

  onImagePicked(event: Event){
    const file=(event.target as HTMLInputElement).files?.item(0);
    this.form.patchValue({image : file});
    this.form.get('image')?.updateValueAndValidity();
    const reader =new FileReader();
    reader.onload =()=>{
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL((file as Blob));

  }

}
