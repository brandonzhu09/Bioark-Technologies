import { Component } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  cartCount = 0;
  queryForm = new FormGroup({
    query: new FormControl(''),
  });

  constructor(private cartService: CartService, public authService: AuthService, private router: Router, private location: Location) { }

  ngOnInit() {
    this.cartService.cartCount$.subscribe(count => {
      this.cartCount = count;
    });
  }

  logout() {
    this.authService.logout().subscribe(res => {
      console.log(res)

      this.router.navigate(['/']).then(() => {
        window.location.reload();
      });

      this.authService.isAuthenticated = false;
    });
  }

  search() {
    this.router.navigate(['/search'], { queryParams: { q: this.queryForm.value.query } })

  }
}
