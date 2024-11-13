import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const API_BASE_URL = 'http://localhost:8000';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  isAuthenticated: boolean = false;

  getSession() {
    return this.http.get<any>(`${API_BASE_URL}/api/session/`, { withCredentials: true });
  }

  getCSRF() {
    return this.http.get<any>(`${API_BASE_URL}/api/csrf/`, { withCredentials: true });
  }

  login(credentials: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-CSRFToken': this.getCookie('csrftoken') || 'hi'
    });

    return this.http.post(`${API_BASE_URL}/api/login/`, credentials, { headers: headers, withCredentials: true });
  }

  getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) {
      return match[2];
    }
    return null;
  }

  // getCookie(name: string): string | null {
  //   const cookies = document.cookie.split(';');
  //   for (let cookie of cookies) {
  //     cookie = cookie.trim();
  //     if (cookie.startsWith(name + '=')) {
  //       return cookie.substring(name.length + 1);
  //     }
  //   }
  //   return null;
  // }
}
