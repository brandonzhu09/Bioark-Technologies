import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  constructor() { }

  calculateDeliveryFee(subtotal: number) {
    if (subtotal >= 500) {
      return 0;
    }
    return 43;
  }
}
