import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  email = '';
  newPassword = '';
  confirmPassword = '';
  step: 'email' | 'password' = 'email';
  error = '';
  message = '';
  loading = false;
  showNewPassword = false;
  showConfirmPassword = false;

  constructor(private authService: AuthService, private router: Router) {}

  verifyEmail(): void {
    if (!this.email) {
      this.error = 'Please enter your registered email address.';
      return;
    }

    this.loading = true;
    this.error = '';
    this.authService.verifyForgotPasswordEmail(this.email).subscribe({
      next: (response) => {
        this.email = response.email;
        this.message = response.message;
        this.step = 'password';
        this.loading = false;
      },
      error: (error) => {
        this.error = error.error?.message || 'Unable to verify this email address.';
        this.loading = false;
      }
    });
  }

  resetPassword(): void {
    if (!this.newPassword || !this.confirmPassword) {
      this.error = 'Please enter and confirm your new password.';
      return;
    }

    this.loading = true;
    this.error = '';
    this.authService.resetForgotPassword(this.email, this.newPassword, this.confirmPassword).subscribe({
      next: (response) => {
        this.message = response.message;
        this.loading = false;
        setTimeout(() => this.router.navigate(['/login']), 900);
      },
      error: (error) => {
        this.error = error.error?.message || 'Password reset failed.';
        this.loading = false;
      }
    });
  }
}
