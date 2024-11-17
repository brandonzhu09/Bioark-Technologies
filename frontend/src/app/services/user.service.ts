import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  viewOrders() {
    return this.http.get<any>(`${environment.apiBaseUrl}/users/view-orders/`, { withCredentials: true });
  }
}
