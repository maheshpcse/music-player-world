import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  chromelessRoutes = new Set(['/login', '/signup', '/home']);
  currentUrl: string;

  constructor(private router: Router) {
    this.currentUrl = this.router.url.split('?')[0];
    this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd)).subscribe((event) => {
      this.currentUrl = event.urlAfterRedirects.split('?')[0];
    });
  }

  get showChrome(): boolean {
    return !this.chromelessRoutes.has(this.currentUrl);
  }
}
