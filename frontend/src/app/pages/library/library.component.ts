import { Component, OnInit } from '@angular/core';
import { MusicService } from '../../shared/music.service';
import { Song } from '../../shared/song.model';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent implements OnInit {
  songs: Song[] = [];

  constructor(private musicService: MusicService) {}

  ngOnInit(): void {
    this.musicService.getSongs().subscribe({
      next: (songs) => {
        this.songs = songs;
      }
    });
  }
}
