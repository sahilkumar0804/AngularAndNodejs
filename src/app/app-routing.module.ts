import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGard } from './auth/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { PostListComponent } from './posts/post-list/post-list.component';


const routes: Routes = [
  {path :'', component : PostListComponent},
  {path : 'create' , component : PostCreateComponent , canActivate: [AuthGard]},
  {path : 'edit/:postId' , component : PostCreateComponent, canActivate: [AuthGard]},
  //{path : 'auth', loadChildren : './auth/auth.module'}
  {path: 'login' ,component: LoginComponent },
  {path: "signup", component: SignupComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGard]
})
export class AppRoutingModule { }
