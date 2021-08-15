import { NgModule } from "@angular/core";

import { PostCreateComponent } from './post-create/post-create.component';
import { PostListComponent } from './post-list/post-list.component';


@NgModule({
  declarations:[
    PostCreateComponent,
    PostListComponent,
  ],
  exports:[
    PostCreateComponent,
    PostListComponent,
  ]
})
export class PostModule {

}
