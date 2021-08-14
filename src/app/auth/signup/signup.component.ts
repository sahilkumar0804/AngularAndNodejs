import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  isLoding = false;

  constructor(public authService: AuthService) {

   }

  ngOnInit(): void {
  }

  onSignup(form: NgForm ){
    if(form.invalid)
    return;

    this.authService.createUsere(form.value.email, form.value.password );
  }

}
