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
    // this.authService.getSession().subscribe((response) => {
    //   if (response.isAuthenticated) {
    //     this.authService.isAuthenticated = response.isAuthenticated;
    //   }
    // })
    // this.cartService.loadCartCountFromServer().subscribe();
    // this.authService.getCSRF().subscribe((response) => {
    //   this.authService.csrftoken = response.csrftoken;
    // })
  }
}
