import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';

declare var paypal_sdk: any;

@Component({
  selector: 'shopping-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {

  cartItems: any[] = [];

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    // this.initConfig();
    this.viewCart();
  }

  viewCart() {
    this.cartService.viewCart().subscribe((res) => {
      this.cartItems = res.data;
    })
  }
}
