import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  let isAuthenticated = inject(AuthService).isAuthenticated;
  if (isAuthenticated) {
    return true;
  }
  else {
    inject(Router).navigate(['/login']);
    return false;
  }
};
