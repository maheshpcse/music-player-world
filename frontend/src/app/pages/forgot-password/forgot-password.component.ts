import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/auth.service';
import { AlertService } from '../../shared/alert.service';

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

  constructor(private authService: AuthService, private router: Router, private alerts: AlertService) {}

  verifyEmail(): void {
    if (!this.email) {
      this.error = 'Please enter your registered email address.';
      this.alerts.warning('Email required', this.error);
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
        this.alerts.success('Email verified', response.message);
      },
      error: (error) => {
        this.error = error.error?.message || 'Unable to verify this email address.';
        this.loading = false;
        this.alerts.error('Email verification failed', this.error);
      }
    });
  }

  resetPassword(): void {
    if (!this.newPassword || !this.confirmPassword) {
      this.error = 'Please enter and confirm your new password.';
      this.alerts.warning('Password required', this.error);
      return;
    }

    this.loading = true;
    this.error = '';
    this.authService.resetForgotPassword(this.email, this.newPassword, this.confirmPassword).subscribe({
      next: (response) => {
        this.message = response.message;
        this.loading = false;
        this.alerts.success('Password updated', response.message).then(() => {
          this.router.navigate(['/login']);
        });
      },
      error: (error) => {
        this.error = error.error?.message || 'Password reset failed.';
        this.loading = false;
        this.alerts.error('Password reset failed', this.error);
      }
    });
  }
}
