import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Song } from './song.model';

@Injectable({ providedIn: 'root' })
export class MusicService {
  private readonly apiUrl = 'http://localhost:5000/api/songs';

  constructor(private http: HttpClient) {}

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
}
