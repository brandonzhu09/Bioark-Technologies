import { CanActivateFn, Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { inject } from '@angular/core';

export const checkoutGuard: CanActivateFn = (route, state) => {
  let cartCount = inject(CartService).getCartCount();
  if (cartCount > 0) {
    return true;
  }
  else {
    inject(Router).navigate(['/cart']);
    alert('Please add items to your cart before proceeding to checkout.');
    return false;
  }
};
