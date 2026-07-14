import { Component } from '@angular/core';
import { AppUser, AuthService } from '../../shared/auth.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  step = 1;
  user: AppUser = this.authService.getUser() || {
    id: Date.now(),
    name: '',
    email: '',
    emailNotifications: true,
    pushNotifications: false
  };
  password = '';
  confirmPassword = '';
  message = '';
  saving = false;

  constructor(private authService: AuthService) {}

  saveProfile(): void {
    this.saving = true;
    this.authService.updateProfile(this.user).subscribe({
      next: (user) => {
        this.user = user;
        this.message = 'Profile information updated.';
        this.step = 2;
        this.saving = false;
      },
      error: (error) => {
        this.message = error.error?.message || 'Profile update failed.';
        this.saving = false;
      }
    });
  }

  savePassword(): void {
    if (!this.password || this.password !== this.confirmPassword) {
      this.message = 'Please enter matching passwords.';
      return;
    }

    this.saving = true;
    this.authService.changePassword(this.password).subscribe({
      next: (response) => {
        this.message = response.message;
        this.password = '';
        this.confirmPassword = '';
        this.step = 3;
        this.saving = false;
      },
      error: (error) => {
        this.message = error.error?.message || 'Password update failed.';
        this.saving = false;
      }
    });
  }

  saveNotifications(): void {
    this.saving = true;
    this.authService.updateNotifications(this.user).subscribe({
      next: (user) => {
        this.user = user;
        this.message = 'Notification preferences saved.';
        this.saving = false;
      },
      error: (error) => {
        this.message = error.error?.message || 'Notification update failed.';
        this.saving = false;
      }
    });
  }
}
