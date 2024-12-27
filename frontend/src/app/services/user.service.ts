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

  viewOrders() {
    return this.http.get<any>(`${environment.apiBaseUrl}/api/users/view-orders/`, { withCredentials: true });
  }

  viewCloningCRISPROrders() {
    return this.http.get<any>(`${environment.apiBaseUrl}/api/users/view-cloning-crispr-orders/`, { withCredentials: true });
  }

  viewCloningOverexpressionOrders() {
    return this.http.get<any>(`${environment.apiBaseUrl}/api/users/view-cloning-overexpression-orders/`, { withCredentials: true });
  }

  viewCloningRNAiOrders() {
    return this.http.get<any>(`${environment.apiBaseUrl}/api/users/view-cloning-rnai-orders/`, { withCredentials: true });
  }

  submitContactForm(message: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-CSRFToken': this.authService.getCookie('csrftoken') || ''
    });

    return this.http.post(`${environment.apiBaseUrl}/api/contact-us/`, message, { headers: headers, withCredentials: true });
  }

}
