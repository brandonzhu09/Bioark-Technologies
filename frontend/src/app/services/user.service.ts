import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  viewOrder(payment_token: string) {
    return this.http.get<any>(`${environment.apiBaseUrl}/api/users/view-order/${payment_token}`, { withCredentials: true });
  }

  viewOrders() {
    return this.http.get<any>(`${environment.apiBaseUrl}/api/users/view-orders/`, { withCredentials: true });
  }

  viewCloningCRISPROrders(page_number: number = 1, page_size: number = 5) {
    return this.http.get<any>(`${environment.apiBaseUrl}/api/users/view-cloning-crispr-orders/?page_number=${page_number}&page_size=${page_size}`, { withCredentials: true });
  }

  viewCloningOverexpressionOrders(page_number: number = 1, page_size: number = 5) {
    return this.http.get<any>(`${environment.apiBaseUrl}/api/users/view-cloning-overexpression-orders/?page_number=${page_number}&page_size=${page_size}`, { withCredentials: true });
  }

  viewCloningRNAiOrders(page_number: number = 1, page_size: number = 5) {
    return this.http.get<any>(`${environment.apiBaseUrl}/api/users/view-cloning-rnai-orders/?page_number=${page_number}&page_size=${page_size}`, { withCredentials: true });
  }

  submitContactForm(message: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-CSRFToken': this.authService.getCookie('csrftoken') || ''
    });

    return this.http.post(`${environment.apiBaseUrl}/api/contact-us/`, message, { headers: headers, withCredentials: true });
  }

  submitQuoteForm(message: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-CSRFToken': this.authService.getCookie('csrftoken') || ''
    });

    return this.http.post(`${environment.apiBaseUrl}/api/quote/`, message, { headers: headers, withCredentials: true });
  }

  viewUserInfo() {
    return this.http.get<any>(`${environment.apiBaseUrl}/api/users/view-user-info/`, { withCredentials: true });
  }

  updateUserInfo(infoForm: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-CSRFToken': this.authService.getCookie('csrftoken') || ''
    });

    return this.http.post(`${environment.apiBaseUrl}/api/users/update-user-info/`, infoForm, { headers: headers, withCredentials: true });
  }

  getUserEmail(): Observable<any> {
    return this.http.get<any>(`${environment.apiBaseUrl}/api/users/get-user-email/`, { withCredentials: true });
  }

  resetUserEmail(emailForm: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-CSRFToken': this.authService.getCookie('csrftoken') || ''
    });

    return this.http.post(`${environment.apiBaseUrl}/api/users/reset-user-email/`, emailForm, { headers: headers, withCredentials: true });
  }

  resetUserPassword(passwordForm: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-CSRFToken': this.authService.getCookie('csrftoken') || ''
    });

    return this.http.post(`${environment.apiBaseUrl}/api/users/reset-user-password/`, passwordForm, { headers: headers, withCredentials: true });
  }

}
