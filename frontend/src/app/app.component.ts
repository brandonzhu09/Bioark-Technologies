import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { CartService } from './services/cart.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';

  constructor(private authService: AuthService, private cartService: CartService) { }

  ngOnInit() {
    this.authService.getSession().subscribe((response) => {
      if (response.isAuthenticated) {
        this.authService.isAuthenticated = true;
      }
      else {
        this.authService.isAuthenticated = false;
      }
    });
    this.cartService.loadCartCountFromServer().subscribe();
  }
}
