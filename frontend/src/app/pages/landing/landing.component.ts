import { Component } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {
  titleChars = Array.from('Welcome to Music Player World');
  titleWords = ['Welcome', 'to', 'Music', 'Player', 'World'];
}

