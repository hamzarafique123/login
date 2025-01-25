// src/app/pages/profile/profile.page.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  user: any;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.getUser().subscribe(userData => {
      if (userData) {
        this.user = userData;
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/home']);
  }
}