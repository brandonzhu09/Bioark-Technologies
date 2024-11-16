import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { AuthService } from './auth.service';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { environment } from '../../environment/environment';


@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartCount = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCount.asObservable();
  private readonly CART_COUNT_KEY = 'cart_count';

  constructor(private http: HttpClient, private authService: AuthService) {

  }

  loadCartCountFromServer() {
    return this.http.get<any>(`${environment.apiBaseUrl}/orders/cart/`, { withCredentials: true }).pipe(
      tap(res => {
        this.cartCount.next(res.count);
      })
    );
  }

  addToCart(product_sku: string, product_name: string, unit_size: string, price: string, adjusted_price: string, ready_status: string) {
    this.incrementCartCount();

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-CSRFToken': this.authService.getCookie('csrftoken') || ''
    });

    const body = {
      'cart_item': {
        'product_sku': product_sku,
        'product_name': product_name + ", " + unit_size,
        'unit_size': unit_size,
        'price': price,
        'adjusted_price': adjusted_price,
        'ready_status': ready_status
      },
      'quantity': 1,
    }

    return this.http.post<any>(`${environment.apiBaseUrl}/orders/cart/`, body, {
      headers: headers,
      withCredentials: true
    });
  }

  removeFromCart(product_id: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-CSRFToken': this.authService.getCookie('csrftoken') || ''
    });

    const body = {
      'remove': true,
      'product_id': product_id
    }

    return this.http.post<any>(`${environment.apiBaseUrl}/orders/cart/`, body, {
      headers: headers,
      withCredentials: true
    }).pipe(tap(res => {
      this.cartCount.next(res.count);
    }));

  }

  updateItemQuantity(product_id: number, quantity: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-CSRFToken': this.authService.getCookie('csrftoken') || ''
    });

    const body = {
      'updateQuantity': true,
      'product_id': product_id,
      'quantity': quantity
    }

    return this.http.post<any>(`${environment.apiBaseUrl}/orders/cart/`, body, {
      headers: headers,
      withCredentials: true
    }).pipe(tap(res => {
      this.cartCount.next(res.count);
    }));
  }

  viewCart() {
    return this.http.get<any>(`${environment.apiBaseUrl}/orders/cart/`, { withCredentials: true });
  }

  getCartCount(): number {
    return this.cartCount.value;
  }

  setCartCount(count: number): void {
    // Update the local cart count
    this.cartCount.next(count);
    // Persist the cart count to localStorage
    localStorage.setItem(this.CART_COUNT_KEY, count.toString());
  }

  incrementCartCount(): void {
    const currentCount = this.getCartCount();
    this.setCartCount(currentCount + 1);
  }

  decrementCartCount(): void {
    const currentCount = this.getCartCount();
    if (currentCount > 0) {
      this.setCartCount(currentCount - 1);
    }
  }
}
