import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy{

  isLoding = false;
  private authStatusSub!: Subscription;

  constructor(public authService: AuthService) {

   }

  ngOnInit(): void {
    this.authStatusSub=this.authService.getAuthStatusListner()
    .subscribe(
      authStaus=>{
        this.isLoding =  false;
      }
    );
  }



  onSignup(form: NgForm ){
    if(form.invalid)
    return;
    this.isLoding=true;
    this.authService.createUsere(form.value.email, form.value.password );
  }


  ngOnDestroy(){
    this.authStatusSub.unsubscribe();
  }
}
