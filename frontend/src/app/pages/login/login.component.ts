import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  remember = true;
  error = '';
  loading = false;
  showPassword = false;
  titleChars = Array.from('Welcome To Music Player World');
  titleWords = ['Welcome', 'To', 'Music', 'Player', 'World'];

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    if (!this.email || !this.password) {
      this.error = 'Please enter your email and password.';
      return;
    }

    this.loading = true;
    this.authService.login(this.email, this.password, this.remember).subscribe({
      next: () => this.router.navigate(['/home']),
      error: (error) => {
        this.error = error.error?.message || 'Login failed. Please check your credentials.';
        this.loading = false;
      }
    });
  }
}

