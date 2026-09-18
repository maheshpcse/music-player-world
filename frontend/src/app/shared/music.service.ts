import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';
import { Song } from './song.model';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

export interface SongPayload {
  title: string;
  artist: string;
  album?: string;
  genre?: string;
  songType?: string;
  durationSeconds?: number;
  coverUrl?: string;
  audioUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class MusicService {
  private readonly apiUrl = environment.apiUrl + '/songs';
  private readonly selectedSongSubject = new BehaviorSubject<Song | null>(null);
  selectedSong$ = this.selectedSongSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {}

  playFromLibrary(song: Song): void {
    this.selectedSongSubject.next(song);
  }

  clearSelectedSong(): void {
    this.selectedSongSubject.next(null);
  }

  getSongs(search = '', genre = 'All'): Observable<Song[]> {
    let params = new HttpParams();
    if (search) {
      params = params.set('search', search);
    }
    if (genre !== 'All') {
      params = params.set('genre', genre);
    }

    return this.http.get<Song[]>(this.apiUrl, { params });
  }

  getGenres(songs: Song[]): string[] {
    return ['All', ...Array.from(new Set(songs.map((song) => song.genre)))];
  }

  createSong(song: SongPayload): Observable<Song> {
    return this.http.post<Song>(this.apiUrl, song, { headers: this.authHeaders() });
  }

  updateSong(id: number, song: SongPayload): Observable<Song> {
    return this.http.put<Song>(`${this.apiUrl}/${id}`, song, { headers: this.authHeaders() });
  }

  deleteSong(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`, { headers: this.authHeaders() });
  }

  uploadSong(song: SongPayload, audio: File): Observable<Song> {
    const formData = new FormData();
    formData.append('audio', audio);
    formData.append('title', song.title);
    formData.append('artist', song.artist);
    formData.append('album', song.album || '');
    formData.append('genre', song.genre || '');
    formData.append('songType', song.songType || '');
    formData.append('durationSeconds', String(song.durationSeconds || 0));
    formData.append('coverUrl', song.coverUrl || '');

    return this.http.post<Song>(`${this.apiUrl}/upload`, formData, { headers: this.authHeaders() });
  }

  syncLocalSongs(): Observable<{ songs: Song[] }> {
    return this.http.post<{ songs: Song[] }>(`${this.apiUrl}/sync-local`, {}, { headers: this.authHeaders() });
  }

  private authHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken() || ''}`
    });
  }
}
