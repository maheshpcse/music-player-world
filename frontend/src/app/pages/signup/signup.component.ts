import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/auth.service';
import { AlertService } from '../../shared/alert.service';

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

  constructor(private authService: AuthService, private router: Router, private alerts: AlertService) {}

  signup(): void {
    if (!this.name || !this.email || !this.password) {
      this.error = 'Please complete all signup fields.';
      this.alerts.warning('Missing signup details', this.error, {
        timer: 1400,
        timerProgressBar: false
      });
      return;
    }

    this.loading = true;
    this.authService.signup(this.name, this.email, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/home']).then(() => {
          this.alerts.success('Account created', 'Your music profile is ready.', {
            timer: 1400,
            timerProgressBar: false
          });
        });
      },
      error: (error) => {
        this.error = error.error?.message || 'Signup failed. Please try again.';
        this.loading = false;
        this.alerts.error('Signup failed', this.error, {
          timer: 1400,
          timerProgressBar: false
        });
      }
    });
  }
}
