import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  chromelessRoutes = new Set(['/', '/login', '/signup', '/forgot-password']);
  routeAnimationClass = 'slide-left route-tick-a';
  currentUrl: string;
  private readonly routeOrder = ['/', '/login', '/signup', '/forgot-password', '/home', '/library', '/about', '/contact', '/my-account', '/settings'];
  private previousRouteIndex: number;
  private animationFlip = false;

  constructor(private router: Router) {
    this.currentUrl = this.router.url.split('?')[0];
    this.previousRouteIndex = this.getRouteIndex(this.currentUrl);
    this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd)).subscribe((event) => {
      const nextUrl = event.urlAfterRedirects.split('?')[0];
      const nextRouteIndex = this.getRouteIndex(nextUrl);
      const direction = nextRouteIndex >= this.previousRouteIndex ? 'slide-left' : 'slide-right';

      this.animationFlip = !this.animationFlip;
      this.routeAnimationClass = `${direction} ${this.animationFlip ? 'route-tick-a' : 'route-tick-b'}`;
      this.currentUrl = nextUrl;
      this.previousRouteIndex = nextRouteIndex;
      setTimeout(() => this.resetAllScrollPositions(), 0);
    });
  }

  get showChrome(): boolean {
    return !this.chromelessRoutes.has(this.currentUrl);
  }

  private getRouteIndex(url: string): number {
    const index = this.routeOrder.indexOf(url);
    return index >= 0 ? index : this.routeOrder.length;
  }

  private resetAllScrollPositions(): void {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    document.querySelectorAll<HTMLElement>('*').forEach((element) => {
      if (element.scrollTop || element.scrollLeft) {
        element.scrollTop = 0;
        element.scrollLeft = 0;
      }
    });
  }
}
