import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  private authListnerSubs!: Subscription;

  constructor(private authService :AuthService) { }

  ngOnInit(): void {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListnerSubs = this.authService.getAuthStatusListner()
    .subscribe(isAuthenticated =>{
      this.userIsAuthenticated = isAuthenticated;
    })
  }

  ngOnDestroy(){
    this.authListnerSubs.unsubscribe();
  }

  onLogout(){
    this.authService.logout();
  }
}
