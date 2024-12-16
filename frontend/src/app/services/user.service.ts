import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

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
}
