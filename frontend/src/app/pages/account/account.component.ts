import { Component, OnInit } from '@angular/core';
import { AppUser, AuthService } from '../../shared/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  user: AppUser | null = this.authService.getUser();

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.me().subscribe({
      next: (user) => {
        this.user = user;
      },
      error: () => {
        this.user = this.authService.getUser();
      }
    });
  }
}
