import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { PrimaryButtonComponent } from '../../components/primary-button/primary-button.component';
import { QuantityInputComponent } from '../../components/quantity-input/quantity-input.component';
import { CheckoutService } from '../../services/checkout.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

declare var paypal_sdk: any;

@Component({
  selector: 'shopping-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
  standalone: true,
  imports: [PrimaryButtonComponent, QuantityInputComponent, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule, CommonModule]
})
export class CartComponent implements OnInit {

  cartItems: any[] = [];
  subTotal: number = 0;
  totalItems: number = 0;
  errorMsg: string = '';

  quoteNumber: FormControl = new FormControl('', Validators.required);

  constructor(private cartService: CartService, public checkoutService: CheckoutService) { }

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

  addQuoteToCart() {
    if (this.quoteNumber.valid) {
      this.cartService.addQuoteToCart(this.quoteNumber.value).subscribe(
        (res) => {
          window.location.reload();
        },
        (error) => {
          this.errorMsg = error.error.detail;
        }
      )
    }
  }
}
