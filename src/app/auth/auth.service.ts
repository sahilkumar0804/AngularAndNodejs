import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";

import { AuthData } from "./auth-data.model";

@Injectable({providedIn : 'root'})
export class AuthService{
  private token! : String | undefined | null;
  private authStatusListner =new Subject<boolean>();
  private isAuthenticated= false;
  private tokenTimer!: any;
  private userId!: string | null | undefined;

  constructor(private http: HttpClient, private router: Router){}

  getToken(){
    return this.token;
  }

  getAuthStatusListner(){
    return this.authStatusListner.asObservable();
  }

  getIsAuth(){
    return this.isAuthenticated;
  }

  getUserId(){
    return this.userId;
  }

  createUsere(email: string , password: string){
    const authData: AuthData ={
      email:email,
      password :password
    }
    this.http.post("http://localhost:3000/api/users/signup",authData)
    .subscribe(response=>{
      console.log(response);
    });
  }

  login(email: string , password: string){
    const authData: AuthData ={
      email: email,
      password :password
    }
    this.http.post< {
      token: string,
      expiresIn: number
      userId : string
    } >("http://localhost:3000/api/users/login",authData)
    .subscribe(response=>{
      const token =response.token;
      this.token =token;
      if(token){
        const expiresInDuration =response.expiresIn;
        this.tokenTimer= setTimeout(()=>{
          this.logout();
        }, expiresInDuration* 1000);
        this.userId= response.userId;
        this.isAuthenticated =true;
        this.authStatusListner.next(true);
        const now =new Date();
        const expirationDate =new Date(now.getTime() + expiresInDuration * 1000);
        this.saveAuthData(token, expirationDate ,this.userId);
       this.router.navigate(["/create"]);
      }

    });
  }


  autoAuthUser(){
   const authInformation= this.getAuthData();
   const now = new Date();
   const expiresIn =(authInformation?.expiration)? authInformation?.expiration.getTime() -now.getTime() : 0;
   if(expiresIn > 0){
     this.token = authInformation?.token;
     this.isAuthenticated = true;
     this.userId =authInformation?.userId;
     this.setAuthTimer(expiresIn / 1000);
     this.authStatusListner.next(true);
   }
  }

  logout(){
    this.token = null;
    this.isAuthenticated =false;
    clearTimeout(this.tokenTimer);
    this.authStatusListner.next(false);
    this.userId = null;
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private setAuthTimer(duration: number){

    this.tokenTimer= setTimeout(()=>{
      this.logout();
    }, duration* 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId :string){
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('expiration', expirationDate.toISOString());

  }

  private clearAuthData(){
    localStorage.removeItem('item');
    localStorage.removeItem('expiration');
  }

  private getAuthData(){
    const token =localStorage.getItem('token');
    const expiration =localStorage.getItem('expiration');
    const userId =localStorage.getItem('userId');
    if(!token || !expiration){
      return;
    }
    return{
      token: token,
      expiration: new Date(expiration),
      userId
    }
  }
}
