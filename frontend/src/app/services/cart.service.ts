import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

const API_BASE_URL = 'http://localhost:8000';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  addToCart(product_sku: string, product_name: string, unit_size: string, price: string, adjusted_price: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-CSRFToken': this.authService.getCookie('csrftoken') || ''
    });

    const body = {
      'cart_item': {
        'product_sku': product_sku,
        'product_name': product_name,
        'unit_size': unit_size,
        'price': price,
        'adjusted_price': adjusted_price
      },
      'quantity': 1,
    }

    console.log(headers)

    return this.http.post(`${API_BASE_URL}/orders/cart/`, body, {
      headers: headers,
      withCredentials: true
    });
  }

  viewCart() {
    return this.http.get<any>(`${API_BASE_URL}/orders/cart/`, { withCredentials: true });
  }
}
