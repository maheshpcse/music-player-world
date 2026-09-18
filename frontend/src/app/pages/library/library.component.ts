import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '../../shared/alert.service';
import { MusicService, SongPayload } from '../../shared/music.service';
import { Song } from '../../shared/song.model';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent implements OnInit, OnDestroy {
  @ViewChild('audioInput') audioInput?: ElementRef<HTMLInputElement>;
  @ViewChild('libraryPage') libraryPage?: ElementRef<HTMLElement>;
  @ViewChild('libraryFlip') libraryFlip?: ElementRef<HTMLElement>;

  songs: Song[] = [];
  saving = false;
  syncing = false;
  selectedAudio?: File;
  songForm: SongPayload = this.emptySongForm();
  libraryMode: 'list' | 'form' | 'upload' = 'list';
  editingSongId?: number;
  listGenreFilter = 'All';
  listTypeFilter = 'All';
  genreFilterMenuOpen = false;
  genreFilterMenuRendered = false;
  typeFilterMenuOpen = false;
  typeFilterMenuRendered = false;
  uploadPreview = false;
  songTypes = ['Original', 'Cover', 'Remix', 'Instrumental', 'Live', 'Podcast'];
  songGenres = ['Pop', 'Dance', 'Synth', 'Indie', 'Soul', 'Funk', 'Jazz', 'Rock', 'Local'];
  previewImage = 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=80';
  defaultCoverUrl = 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=800&q=80';
  private selectedAudioObjectUrl?: string;
  private genreFilterCloseTimer?: ReturnType<typeof setTimeout>;
  private typeFilterCloseTimer?: ReturnType<typeof setTimeout>;

  constructor(
    private musicService: MusicService,
    private alerts: AlertService,
    private router: Router,
    private hostElement: ElementRef<HTMLElement>
  ) {}

  ngOnInit(): void {
    this.musicService.getSongs().subscribe({
      next: (songs) => {
        this.songs = songs;
      }
    });
  }

  get listGenres(): string[] {
    return ['All', ...Array.from(new Set(this.songs.map((song) => song.genre).filter(Boolean)))];
  }

  get listSongTypes(): string[] {
    return ['All', ...Array.from(new Set(this.songs.map((song) => song.songType || 'Original')))];
  }

  get filteredLibrarySongs(): Song[] {
    return this.songs.filter((song) => {
      const matchesGenre = this.listGenreFilter === 'All' || song.genre === this.listGenreFilter;
      const matchesType = this.listTypeFilter === 'All' || (song.songType || 'Original') === this.listTypeFilter;
      return matchesGenre && matchesType;
    });
  }

  ngOnDestroy(): void {
    this.cancelGenreFilterClose();
    this.cancelTypeFilterClose();
    this.revokeSelectedAudioObjectUrl();
  }

  onAudioSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedAudio = input.files?.[0];
    if (this.selectedAudio) {
      this.prepareUploadPreview();
      this.extractAudioDuration(this.selectedAudio);
    }
  }

  openLibraryMode(mode: 'list' | 'form' | 'upload'): void {
    if (mode !== this.libraryMode) {
      this.resetSongForm();
    }
    this.libraryMode = mode;
    this.resetLibraryScroll();
  }

  selectListGenre(genre: string): void {
    this.listGenreFilter = genre;
    this.closeGenreFilterMenu();
  }

  selectListType(type: string): void {
    this.listTypeFilter = type;
    this.closeTypeFilterMenu();
  }

  toggleGenreFilterMenu(): void {
    if (this.genreFilterMenuOpen) {
      this.closeGenreFilterMenu();
      return;
    }

    this.cancelGenreFilterClose();
    this.genreFilterMenuRendered = true;
    setTimeout(() => {
      this.genreFilterMenuOpen = true;
    }, 0);
  }

  toggleTypeFilterMenu(): void {
    if (this.typeFilterMenuOpen) {
      this.closeTypeFilterMenu();
      return;
    }

    this.cancelTypeFilterClose();
    this.typeFilterMenuRendered = true;
    setTimeout(() => {
      this.typeFilterMenuOpen = true;
    }, 0);
  }

  closeGenreFilterMenu(): void {
    this.genreFilterMenuOpen = false;
    setTimeout(() => {
      if (!this.genreFilterMenuOpen) {
        this.genreFilterMenuRendered = false;
      }
    }, 180);
  }

  closeTypeFilterMenu(): void {
    this.typeFilterMenuOpen = false;
    setTimeout(() => {
      if (!this.typeFilterMenuOpen) {
        this.typeFilterMenuRendered = false;
      }
    }, 180);
  }

  scheduleGenreFilterClose(): void {
    this.cancelGenreFilterClose();
    this.genreFilterCloseTimer = setTimeout(() => this.closeGenreFilterMenu(), 280);
  }

  scheduleTypeFilterClose(): void {
    this.cancelTypeFilterClose();
    this.typeFilterCloseTimer = setTimeout(() => this.closeTypeFilterMenu(), 280);
  }

  cancelGenreFilterClose(): void {
    if (this.genreFilterCloseTimer) {
      clearTimeout(this.genreFilterCloseTimer);
      this.genreFilterCloseTimer = undefined;
    }
  }

  cancelTypeFilterClose(): void {
    if (this.typeFilterCloseTimer) {
      clearTimeout(this.typeFilterCloseTimer);
      this.typeFilterCloseTimer = undefined;
    }
  }

  resetSongForm(): void {
    this.songForm = this.emptySongForm();
    this.editingSongId = undefined;
    this.selectedAudio = undefined;
    this.uploadPreview = false;
    this.revokeSelectedAudioObjectUrl();
    if (this.audioInput?.nativeElement) {
      this.audioInput.nativeElement.value = '';
    }
  }

  playSong(song: Song): void {
    this.musicService.playFromLibrary(song);
    this.router.navigate(['/home']);
  }

  editSong(song: Song, event?: Event): void {
    event?.stopPropagation();
    this.editingSongId = song.id;
    this.songForm = {
      title: song.title,
      artist: song.artist,
      album: song.album,
      genre: song.genre,
      songType: song.songType || 'Original',
      durationSeconds: song.durationSeconds,
      coverUrl: song.coverUrl,
      audioUrl: song.audioUrl
    };
    this.libraryMode = 'form';
    this.resetLibraryScroll();
  }

  async deleteSong(song: Song, event?: Event): Promise<void> {
    event?.stopPropagation();
    const confirmed = await this.alerts.confirmDelete(
      'Delete song?',
      `Delete "${song.title}" from the library? Local uploaded files will also be removed.`
    );
    if (!confirmed) {
      return;
    }

    this.saving = true;
    this.musicService.deleteSong(song.id).subscribe({
      next: () => {
        this.songs = this.songs.filter((item) => item.id !== song.id);
        this.saving = false;
        this.alerts.success('Song deleted', 'Song was removed from the library and local storage.');
      },
      error: (error) => {
        this.saving = false;
        this.alerts.error('Delete failed', error.error?.message || 'Unable to delete this song.');
      }
    });
  }

  saveMetadata(): void {
    if (!this.songForm.title || !this.songForm.artist || !this.songForm.audioUrl) {
      this.alerts.warning('Song details required', 'Enter title, artist, and an audio URL before saving.');
      return;
    }

    this.saving = true;
    const editingSongId = this.editingSongId;
    const request = editingSongId
      ? this.musicService.updateSong(editingSongId, this.songForm)
      : this.musicService.createSong(this.songForm);

    request.subscribe({
      next: (song) => {
        this.songs = editingSongId
          ? this.songs.map((item) => item.id === song.id ? song : item)
          : [song, ...this.songs];
        this.resetSongForm();
        this.libraryMode = 'list';
        this.saving = false;
        this.alerts.success(editingSongId ? 'Song updated' : 'Song saved', editingSongId ? 'Song details were updated.' : 'Song metadata was added to the library.');
      },
      error: (error) => {
        this.saving = false;
        this.alerts.error(editingSongId ? 'Song update failed' : 'Song save failed', error.error?.message || 'Unable to save song metadata.');
      }
    });
  }

  prepareUploadPreview(): void {
    if (!this.selectedAudio) {
      return;
    }

    if (!this.songForm.title) {
      this.songForm.title = this.selectedAudio.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ');
    }
    if (!this.songForm.artist) {
      this.songForm.artist = 'Unknown Artist';
    }
    if (!this.songForm.album) {
      this.songForm.album = 'Local Uploads';
    }
    if (!this.songForm.genre) {
      this.songForm.genre = 'Local';
    }
    if (!this.songForm.songType) {
      this.songForm.songType = 'Original';
    }

    this.uploadPreview = true;
  }

  confirmUpload(): void {
    if (!this.uploadPreview) {
      this.prepareUploadPreview();
    }
    if (!this.selectedAudio) {
      this.alerts.warning('Audio file required', 'Choose an audio file before uploading.');
      return;
    }

    this.saving = true;
    this.musicService.uploadSong(this.songForm, this.selectedAudio).subscribe({
      next: (song) => {
        this.songs = [song, ...this.songs];
        this.songForm = this.emptySongForm();
        this.selectedAudio = undefined;
        this.uploadPreview = false;
        this.revokeSelectedAudioObjectUrl();
        this.libraryMode = 'list';
        this.saving = false;
        this.alerts.success('Song uploaded', 'Audio file was stored locally and saved to the library.');
      },
      error: (error) => {
        this.saving = false;
        this.alerts.error('Song upload failed', error.error?.message || 'Unable to upload this audio file.');
      }
    });
  }

  syncLocalSongs(): void {
    this.syncing = true;
    this.musicService.syncLocalSongs().subscribe({
      next: (response) => {
        this.syncing = false;
        this.alerts.success('Local songs loaded', `${response.songs.length} new local song(s) added.`);
        this.reloadSongs();
      },
      error: (error) => {
        this.syncing = false;
        this.alerts.error('Local sync failed', error.error?.message || 'Unable to load songs from local storage.');
      }
    });
  }

  private reloadSongs(): void {
    this.musicService.getSongs().subscribe({
      next: (songs) => {
        this.songs = songs;
      }
    });
  }

  private resetLibraryScroll(): void {
    const reset = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      if (this.libraryPage?.nativeElement) {
        this.libraryPage.nativeElement.scrollTop = 0;
        this.libraryPage.nativeElement.scrollLeft = 0;
        this.libraryPage.nativeElement.scrollIntoView({ block: 'start', inline: 'nearest', behavior: 'auto' });
      }

      this.hostElement.nativeElement.closest<HTMLElement>('.page-shell')?.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      this.hostElement.nativeElement.closest<HTMLElement>('.route-frame')?.scrollTo({ top: 0, left: 0, behavior: 'auto' });

      this.libraryFlip?.nativeElement.querySelectorAll<HTMLElement>('.library-face').forEach((face) => {
        face.scrollTop = 0;
        face.scrollLeft = 0;
      });
      this.libraryFlip?.nativeElement.querySelectorAll<HTMLElement>('.library-list-scroll').forEach((scrollArea) => {
        scrollArea.scrollTop = 0;
        scrollArea.scrollLeft = 0;
      });
    };

    reset();
    requestAnimationFrame(reset);
    setTimeout(reset, 80);
    setTimeout(reset, 320);
  }

  private extractAudioDuration(audioFile: File): void {
    this.revokeSelectedAudioObjectUrl();
    this.selectedAudioObjectUrl = URL.createObjectURL(audioFile);

    const audio = new Audio();
    audio.preload = 'metadata';
    audio.src = this.selectedAudioObjectUrl;
    audio.onloadedmetadata = () => {
      if (Number.isFinite(audio.duration)) {
        this.songForm.durationSeconds = Math.round(audio.duration);
      }
    };
    audio.onerror = () => {
      this.alerts.warning('Duration unavailable', 'This audio file duration could not be read automatically.');
    };
  }

  private revokeSelectedAudioObjectUrl(): void {
    if (this.selectedAudioObjectUrl) {
      URL.revokeObjectURL(this.selectedAudioObjectUrl);
      this.selectedAudioObjectUrl = undefined;
    }
  }

  private emptySongForm(): SongPayload {
    return {
      title: '',
      artist: '',
      album: '',
      genre: 'Local',
      songType: 'Original',
      durationSeconds: 0,
      coverUrl: '',
      audioUrl: ''
    };
  }
}
