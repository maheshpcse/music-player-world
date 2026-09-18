import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { MusicService } from '../../shared/music.service';
import { Song } from '../../shared/song.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('audioPlayer') audioPlayer?: ElementRef<HTMLAudioElement>;

  search = '';
  selectedGenre = 'All';
  genreMenuOpen = false;
  genreMenuRendered = false;
  private genreCloseTimer?: ReturnType<typeof setTimeout>;
  isPlaying = false;
  volume = 30;
  currentTime = 0;
  songs: Song[] = [];
  genres: string[] = ['All'];
  defaultCoverUrl = 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=80';
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
  private selectedSongSubscription?: Subscription;
  private viewReady = false;
  private pendingAutoplay = false;

  constructor(private musicService: MusicService) {}

  ngOnInit(): void {
    this.selectedSongSubscription = this.musicService.selectedSong$.subscribe((song) => {
      if (song) {
        this.applySong(song, true);
        this.musicService.clearSelectedSong();
      }
    });

    this.musicService.getSongs().subscribe({
      next: (songs) => {
        this.songs = songs;
        this.genres = this.musicService.getGenres(songs);
        if (songs.length && this.currentSong.id === 0) {
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
    this.viewReady = true;
    this.syncVolume();
    if (this.pendingAutoplay) {
      this.pendingAutoplay = false;
      setTimeout(() => this.play(), 0);
    }
  }

  ngOnDestroy(): void {
    this.selectedSongSubscription?.unsubscribe();
    this.pause();
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
    this.closeGenreMenu();
  }

  toggleGenreMenu(): void {
    if (this.genreMenuOpen) {
      this.closeGenreMenu();
      return;
    }

    this.cancelGenreClose();
    this.genreMenuRendered = true;
    setTimeout(() => {
      this.genreMenuOpen = true;
    }, 0);
  }

  closeGenreMenu(): void {
    this.genreMenuOpen = false;
    setTimeout(() => {
      if (!this.genreMenuOpen) {
        this.genreMenuRendered = false;
      }
    }, 180);
  }

  scheduleGenreClose(): void {
    this.cancelGenreClose();
    this.genreCloseTimer = setTimeout(() => this.closeGenreMenu(), 280);
  }

  cancelGenreClose(): void {
    if (this.genreCloseTimer) {
      clearTimeout(this.genreCloseTimer);
      this.genreCloseTimer = undefined;
    }
  }

  selectSong(song: Song): void {
    this.applySong(song, true);
  }

  previous(): void {
    if (!this.songs.length) {
      return;
    }
    const index = this.songs.findIndex((song) => song.id === this.currentSong.id);
    this.currentSong = this.songs[(index - 1 + this.songs.length) % this.songs.length];
    this.afterTrackChange(true);
  }

  next(): void {
    if (!this.songs.length) {
      return;
    }
    const index = this.songs.findIndex((song) => song.id === this.currentSong.id);
    this.currentSong = this.songs[(index + 1) % this.songs.length];
    this.afterTrackChange(true);
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

  seek(event: MouseEvent): void {
    const audio = this.audioPlayer?.nativeElement;
    const target = event.currentTarget as HTMLElement;
    const duration = audio?.duration || this.currentSong.durationSeconds;
    if (!target || !duration) {
      return;
    }

    const rect = target.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    const nextTime = Math.floor(duration * ratio);
    this.currentTime = nextTime;
    if (audio) {
      audio.currentTime = nextTime;
    }
  }

  format(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remaining = seconds % 60;
    return `${minutes}:${remaining.toString().padStart(2, '0')}`;
  }

  private afterTrackChange(shouldAutoplay = false): void {
    this.currentTime = 0;
    setTimeout(() => {
      if (shouldAutoplay || this.isPlaying) {
        this.play();
      }
    }, 0);
  }

  private applySong(song: Song, autoplay = false): void {
    this.currentSong = song;
    this.currentTime = 0;
    if (!autoplay) {
      return;
    }

    if (this.viewReady) {
      setTimeout(() => this.play(), 0);
      return;
    }

    this.pendingAutoplay = true;
  }
}
