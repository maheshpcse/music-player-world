import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

export interface AppUser {
  id: number;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  emailNotifications?: boolean;
  pushNotifications?: boolean;
}

const USER_KEY = 'music_player_user';
const TOKEN_KEY = 'music_player_token';
const API_URL = 'http://localhost:5000/api';

interface AuthResponse {
  user: AppUser;
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string, remember: boolean): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_URL}/auth/login`, { email, password }).pipe(
      tap((response) => this.persistSession(response.user, response.token, remember))
    );
  }

  signup(name: string, email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_URL}/auth/signup`, { name, email, password }).pipe(
      tap((response) => this.persistSession(response.user, response.token, true))
    );
  }

  verifyForgotPasswordEmail(email: string): Observable<{ message: string; email: string }> {
    return this.http.post<{ message: string; email: string }>(
      `${API_URL}/auth/forgot-password/verify-email`,
      { email }
    );
  }

  resetForgotPassword(
    email: string,
    newPassword: string,
    confirmPassword: string
  ): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${API_URL}/auth/forgot-password/reset`,
      { email, newPassword, confirmPassword }
    );
  }

  updateUser(user: AppUser): void {
    const storage = localStorage.getItem(USER_KEY) ? localStorage : sessionStorage;
    storage.setItem(USER_KEY, JSON.stringify(user));
  }

  me(): Observable<AppUser> {
    return this.http.get<AppUser>(`${API_URL}/me`, { headers: this.authHeaders() }).pipe(
      tap((user) => this.updateUser(user))
    );
  }

  updateProfile(user: AppUser): Observable<AppUser> {
    return this.http.put<AppUser>(`${API_URL}/me/profile`, user, { headers: this.authHeaders() }).pipe(
      tap((updatedUser) => this.updateUser(updatedUser))
    );
  }

  changePassword(newPassword: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(
      `${API_URL}/me/password`,
      { newPassword },
      { headers: this.authHeaders() }
    );
  }

  updateNotifications(user: AppUser): Observable<AppUser> {
    return this.http.put<AppUser>(
      `${API_URL}/me/notifications`,
      {
        emailNotifications: user.emailNotifications,
        pushNotifications: user.pushNotifications
      },
      { headers: this.authHeaders() }
    ).pipe(tap((updatedUser) => this.updateUser(updatedUser)));
  }

  getUser(): AppUser | null {
    const raw = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) as AppUser : null;
  }

  isLoggedIn(): boolean {
    return Boolean(this.getToken());
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
  }

  logout(): void {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    this.router.navigate(['/login']);
  }

  private persistSession(user: AppUser, token: string, remember: boolean): void {
    const targetStorage = remember ? localStorage : sessionStorage;
    const otherStorage = remember ? sessionStorage : localStorage;
    otherStorage.removeItem(USER_KEY);
    otherStorage.removeItem(TOKEN_KEY);
    targetStorage.setItem(USER_KEY, JSON.stringify(user));
    targetStorage.setItem(TOKEN_KEY, token);
  }

  private authHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.getToken() || ''}`
    });
  }
}
