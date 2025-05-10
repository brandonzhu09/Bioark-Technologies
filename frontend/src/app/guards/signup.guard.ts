import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const signupGuard: CanActivateFn = (route, state) => {
  let isAuthenticated = inject(AuthService).isAuthenticated;
  if (!isAuthenticated) {
    return true;
  }
  else {
    inject(Router).navigate(['/']);
    alert('Please sign out your account before logging or signing up an account.');
    return false;
  }
};
