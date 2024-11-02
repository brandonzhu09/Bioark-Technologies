import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { PrimaryButtonComponent } from '../../components/primary-button/primary-button.component';
import { QuantityInputComponent } from '../../components/quantity-input/quantity-input.component';

declare var paypal_sdk: any;

@Component({
  selector: 'shopping-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
  standalone: true,
  imports: [PrimaryButtonComponent, QuantityInputComponent]
})
export class CartComponent implements OnInit {

  cartItems: any[] = [];
  subTotal: number = 0;
  totalItems: number = 0;

  constructor(private cartService: CartService) { }

  onQuantityChange(item_id: number, quantity: number): void {
    // Handle quantity change - e.g., update total price, save to backend, etc.
    this.cartService.updateItemQuantity(item_id, quantity).subscribe(res => {
      this.cartItems = res.data;
      this.subTotal = res.total_price;
      this.totalItems = res.count;
    })
  }

  removeItem(item_id: number): void {
    this.cartService.removeFromCart(item_id).subscribe(res => {
      this.cartItems = res.data;
      this.subTotal = res.total_price;
      this.totalItems = res.count;
    })
  }

  ngOnInit(): void {
    // this.initConfig();
    this.viewCart();
  }

  viewCart() {
    this.cartService.viewCart().subscribe((res) => {
      this.cartItems = res.data;
      this.subTotal = res.total_price;
      this.totalItems = res.count;
    })
  }
}
