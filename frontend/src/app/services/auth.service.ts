import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  isAuthenticated: boolean = false;
  csrftoken: string = '';

  getSession() {
    return this.http.get<any>(`${environment.apiBaseUrl}/api/session/`, { withCredentials: true });
  }

  getCSRF(): Observable<any> {
    return this.http.get<any>(`${environment.apiBaseUrl}/api/csrf/`, { withCredentials: true });
  }

  async initializeAuth() {
    const sessionResponse = await lastValueFrom(this.getSession());
    this.isAuthenticated = sessionResponse.isAuthenticated;

    const csrfResponse = await lastValueFrom(this.getCSRF());
    this.csrftoken = csrfResponse.csrftoken;
    console.log(this.isAuthenticated, this.csrftoken)
  }

  signup(credentials: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-CSRFToken': this.getCookie('csrftoken') || ''
    });

    return this.http.post(`${environment.apiBaseUrl}/api/signup/`, credentials, { headers: headers, withCredentials: true });
  }

  login(credentials: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-CSRFToken': this.getCookie('csrftoken') || ''
    });

    return this.http.post(`${environment.apiBaseUrl}/api/login/`, credentials, { headers: headers, withCredentials: true });
  }

  logout(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-CSRFToken': this.getCookie('csrftoken') || ''
    });

    return this.http.post(`${environment.apiBaseUrl}/api/logout/`, null, { headers, withCredentials: true });
  }

  getCookie(name: string) {
    // const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    // if (match) {
    //   return match[2];
    // }
    // return null;
    return this.csrftoken;
  }

  verifyEmail(token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-CSRFToken': this.getCookie('csrftoken') || ''
    });
    return this.http.post(`${environment.apiBaseUrl}/api/verify-email/${token}/`, null, { headers, withCredentials: true });
  }

  resendVerification(emailForm: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-CSRFToken': this.getCookie('csrftoken') || ''
    });
    return this.http.post(`${environment.apiBaseUrl}/api/resend-verification/`, emailForm, { headers, withCredentials: true });
  }
}
