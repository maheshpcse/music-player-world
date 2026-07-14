import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  name = '';
  email = '';
  password = '';
  error = '';
  loading = false;
  showPassword = false;
  titleChars = Array.from('Welcome To Music Player World');
  titleWords = ['Welcome', 'To', 'Music', 'Player', 'World'];

  constructor(private authService: AuthService, private router: Router) {}

  signup(): void {
    if (!this.name || !this.email || !this.password) {
      this.error = 'Please complete all signup fields.';
      return;
    }

    this.loading = true;
    this.authService.signup(this.name, this.email, this.password).subscribe({
      next: () => this.router.navigate(['/home']),
      error: (error) => {
        this.error = error.error?.message || 'Signup failed. Please try again.';
        this.loading = false;
      }
    });
  }
}

