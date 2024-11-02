import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  calculateSalesTax(zipcode: number) {
    return this.http.get<any>(`${environment.salesTaxUrl}?zip_code=${zipcode}`, { headers: { 'X-Api-Key': environment.ninjasApiKey } })
  }
}
