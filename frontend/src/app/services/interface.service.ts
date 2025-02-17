import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class InterfaceService {

  constructor(private http: HttpClient) { }

  getProductPage(url: string) {
    return this.http.get<any>(`${environment.apiBaseUrl}/api/interface/get-product-page/${url}/`, { withCredentials: true });
  }

  getServicePage(url: string) {
    return this.http.get<any>(`${environment.apiBaseUrl}/api/interface/get-service-page/${url}/`, { withCredentials: true });
  }

}
