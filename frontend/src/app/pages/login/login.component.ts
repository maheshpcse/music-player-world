import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/auth.service';
import { AlertService } from '../../shared/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = 'maheshpm1599@gmail.com';
  password = '121599';
  remember = false;
  error = '';
  loading = false;
  showPassword = false;
  titleChars = Array.from('Welcome To Music Player World');
  titleWords = ['Welcome', 'To', 'Music', 'Player', 'World'];

  constructor(private authService: AuthService, private router: Router, private alerts: AlertService) {}

  login(): void {
    if (!this.email || !this.password) {
      this.error = 'Please enter your email and password.';
      this.alerts.warning('Missing login details', this.error, {
        timer: 1400,
        timerProgressBar: false
      });
      return;
    }

    this.loading = true;
    this.authService.login(this.email, this.password, this.remember).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/home']).then(() => {
          this.alerts.success('Login successful', 'Welcome back to Music Player World.', {
            timer: 1400,
            timerProgressBar: false
          });
        });
      },
      error: (error) => {
        this.error = error.error?.message || 'Login failed. Please check your credentials.';
        this.loading = false;
        this.alerts.error('Login failed', this.error, {
          timer: 1400,
          timerProgressBar: false
        });
      }
    });
  }
}
