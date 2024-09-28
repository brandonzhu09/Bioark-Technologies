import { Component } from '@angular/core';

declare var paypal_sdk: any;

@Component({
  selector: 'order-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  orderItems = [
    { name: 'Product 1', quantity: 1, price: 20 },
    { name: 'Product 2', quantity: 2, price: 30 },
    { name: 'Product 3', quantity: 1, price: 15 }
  ];

  totalAmount = 95.00;  // Hardcoded for now, but can be dynamically calculated

  constructor() { }

  ngOnInit(): void {
    this.renderPayPalButton();
  }

  renderPayPalButton() {
    paypal_sdk.Buttons({
    }).render('#paypal-button-container');
  }
}
