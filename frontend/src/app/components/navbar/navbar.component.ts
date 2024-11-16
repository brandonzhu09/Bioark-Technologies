import { Component } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';


@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  cartCount = 0;

  constructor(private cartService: CartService, public authService: AuthService, private router: Router, private location: Location) { }

  ngOnInit() {
    this.cartService.cartCount$.subscribe(count => {
      this.cartCount = count;
    });
  }

  logout() {
    this.authService.logout().subscribe(res => {
      console.log(res)
      window.location.href = "/";
      window.location.reload();
    });
  }
}
