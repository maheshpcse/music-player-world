import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  menuOpen = false;
  menuRendered = false;
  private menuCloseTimer?: ReturnType<typeof setTimeout>;

  constructor(public authService: AuthService, private router: Router) {}

  get isProfileRoute(): boolean {
    const route = this.router.url.split('?')[0];
    return route === '/my-account' || route === '/settings';
  }

  toggleMenu(): void {
    if (this.menuOpen) {
      this.closeMenu();
      return;
    }

    this.cancelMenuClose();
    this.menuRendered = true;
    setTimeout(() => {
      this.menuOpen = true;
    }, 0);
  }

  closeMenu(): void {
    this.menuOpen = false;
    setTimeout(() => {
      if (!this.menuOpen) {
        this.menuRendered = false;
      }
    }, 180);
  }

  scheduleMenuClose(): void {
    this.cancelMenuClose();
    this.menuCloseTimer = setTimeout(() => this.closeMenu(), 280);
  }

  cancelMenuClose(): void {
    if (this.menuCloseTimer) {
      clearTimeout(this.menuCloseTimer);
      this.menuCloseTimer = undefined;
    }
  }

  logout(): void {
    this.closeMenu();
    this.authService.logout();
  }
}
