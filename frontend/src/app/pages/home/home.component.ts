import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MusicService } from '../../shared/music.service';
import { Song } from '../../shared/song.model';
import { AuthService } from '../../shared/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild('audioPlayer') audioPlayer?: ElementRef<HTMLAudioElement>;

  search = '';
  selectedGenre = 'All';
  genreMenuOpen = false;
  isPlaying = false;
  volume = 30;
  currentTime = 0;
  songs: Song[] = [];
  genres: string[] = ['All'];
  currentSong: Song = {
    id: 0,
    title: 'Select a Song',
    artist: 'Music Player World',
    album: 'Ready Room',
    genre: 'Idle',
    durationSeconds: 0,
    coverUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=80'
  };
  loading = true;

  constructor(private musicService: MusicService, private authService: AuthService) {}

  ngOnInit(): void {
    this.musicService.getSongs().subscribe({
      next: (songs) => {
        this.songs = songs;
        this.genres = this.musicService.getGenres(songs);
        if (songs.length) {
          this.currentSong = songs[0];
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  ngAfterViewInit(): void {
    this.syncVolume();
  }

  get filteredSongs(): Song[] {
    return this.songs.filter((song) => {
      const matchesSearch = `${song.title} ${song.artist}`.toLowerCase().includes(this.search.toLowerCase());
      const matchesGenre = this.selectedGenre === 'All' || song.genre === this.selectedGenre;
      return matchesSearch && matchesGenre;
    });
  }

  selectGenre(genre: string): void {
    this.selectedGenre = genre;
    this.genreMenuOpen = false;
  }

  closeGenreMenu(): void {
    this.genreMenuOpen = false;
  }

  logout(): void {
    this.authService.logout();
  }

  selectSong(song: Song): void {
    this.currentSong = song;
    this.currentTime = 0;
    setTimeout(() => this.play(), 0);
  }

  previous(): void {
    if (!this.songs.length) {
      return;
    }
    const index = this.songs.findIndex((song) => song.id === this.currentSong.id);
    this.currentSong = this.songs[(index - 1 + this.songs.length) % this.songs.length];
    this.afterTrackChange();
  }

  next(): void {
    if (!this.songs.length) {
      return;
    }
    const index = this.songs.findIndex((song) => song.id === this.currentSong.id);
    this.currentSong = this.songs[(index + 1) % this.songs.length];
    this.afterTrackChange();
  }

  togglePlayback(): void {
    if (this.isPlaying) {
      this.pause();
      return;
    }
    this.play();
  }

  play(): void {
    const audio = this.audioPlayer?.nativeElement;
    if (!audio || !this.currentSong.audioUrl) {
      return;
    }

    audio.play().then(() => {
      this.isPlaying = true;
    }).catch(() => {
      this.isPlaying = false;
    });
  }

  pause(): void {
    this.audioPlayer?.nativeElement.pause();
    this.isPlaying = false;
  }

  syncVolume(): void {
    if (this.audioPlayer?.nativeElement) {
      this.audioPlayer.nativeElement.volume = this.volume / 100;
    }
  }

  updateProgress(): void {
    this.currentTime = Math.floor(this.audioPlayer?.nativeElement.currentTime || 0);
  }

  progressPercent(): number {
    const duration = this.audioPlayer?.nativeElement.duration || this.currentSong.durationSeconds || 1;
    return Math.min(100, (this.currentTime / duration) * 100);
  }

  format(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remaining = seconds % 60;
    return `${minutes}:${remaining.toString().padStart(2, '0')}`;
  }

  private afterTrackChange(): void {
    this.currentTime = 0;
    setTimeout(() => {
      if (this.isPlaying) {
        this.play();
      }
    }, 0);
  }
}
