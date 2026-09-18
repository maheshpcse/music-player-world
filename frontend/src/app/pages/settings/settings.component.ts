import { Component, ElementRef, ViewChild } from '@angular/core';
import { AppUser, AuthService } from '../../shared/auth.service';
import { AlertService } from '../../shared/alert.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  @ViewChild('settingsShell') settingsShell?: ElementRef<HTMLElement>;

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

  constructor(private authService: AuthService, private alerts: AlertService) {}

  selectStep(step: number): void {
    this.step = step;
    this.resetSettingsScroll();
    if (step === 1 || step === 3) {
      this.refreshUserDetails();
    }
  }

  saveProfile(): void {
    this.saving = true;
    this.authService.updateProfile(this.user).subscribe({
      next: (user) => {
        this.user = user;
        this.message = '';
        this.saving = false;
        this.alerts.success('Profile updated');
      },
      error: (error) => {
        this.message = error.error?.message || 'Profile update failed.';
        this.saving = false;
        this.alerts.error('Profile update failed', this.message);
      }
    });
  }

  savePassword(): void {
    if (!this.password || this.password !== this.confirmPassword) {
      this.message = 'Please enter matching passwords.';
      this.alerts.warning('Password mismatch', this.message);
      return;
    }

    this.saving = true;
    this.authService.changePassword(this.password).subscribe({
      next: (response) => {
        this.message = '';
        this.password = '';
        this.confirmPassword = '';
        this.saving = false;
        this.alerts.success('Password updated', response.message);
      },
      error: (error) => {
        this.message = error.error?.message || 'Password update failed.';
        this.saving = false;
        this.alerts.error('Password update failed', this.message);
      }
    });
  }

  saveNotifications(): void {
    this.saving = true;
    this.authService.updateNotifications(this.user).subscribe({
      next: (user) => {
        this.user = user;
        this.message = '';
        this.saving = false;
        this.alerts.success('Notifications saved');
      },
      error: (error) => {
        this.message = error.error?.message || 'Notification update failed.';
        this.saving = false;
        this.alerts.error('Notification update failed', this.message);
      }
    });
  }

  private refreshUserDetails(): void {
    this.authService.me().subscribe({
      next: (user) => {
        this.user = user;
      },
      error: (error) => {
        this.alerts.error('Unable to load account details', error.error?.message || 'Please try again.');
      }
    });
  }

  private resetSettingsScroll(): void {
    setTimeout(() => {
      if (this.settingsShell?.nativeElement) {
        this.settingsShell.nativeElement.scrollTop = 0;
        this.settingsShell.nativeElement.scrollLeft = 0;
      }
    }, 0);
  }
}
