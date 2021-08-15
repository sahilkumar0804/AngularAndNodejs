import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm} from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy{

  isLoding = false;
  private authStatusSub!: Subscription;

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
    this.authStatusSub=this.authService.getAuthStatusListner()
    .subscribe(
      authStaus=>{
        this.isLoding =  false;
      }
    );
  }

  onLogin(form: NgForm ){
    if(form.invalid){
      return;
    }
    this.isLoding=true;
    this.authService.login(form.value.email, form.value.password);
  }

  ngOnDestroy(){
    this.authStatusSub.unsubscribe();
  }
}
