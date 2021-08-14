import { Component ,Input} from '@angular/core';
import { Post } from './post';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // storedPosts :Post[] = [];

  // onPostAdded(@Input() newPost : Post){
  //   console.log(newPost);
  //   this.storedPosts.push(newPost);

  //   console.log("after push");
  //   console.log(this.storedPosts);
  // }
}
