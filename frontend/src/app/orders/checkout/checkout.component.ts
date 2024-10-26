import { Component, OnInit } from '@angular/core';
import {
  IPayPalConfig,
  ICreateOrderRequest
} from 'ngx-paypal';

declare var paypal_sdk: any;

@Component({
  selector: 'order-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {

  public payPalConfig?: IPayPalConfig;

  orderItems = [
    { name: 'Product 1', quantity: 1, price: 20 },
    { name: 'Product 2', quantity: 2, price: 30 },
    { name: 'Product 3', quantity: 1, price: 15 }
  ];

  totalAmount = 95.00;  // Hardcoded for now, but can be dynamically calculated

  constructor() { }

  ngOnInit(): void {
    // this.initConfig();
    this.renderPayPalButton();
  }

  renderPayPalButton() {
    paypal_sdk.Buttons(
      {
        // Call your server to set up the transaction
        createOrder: function () {
          return fetch(
            "http://localhost:8000/orders/checkout/",
            {
              method: "post",
              headers: {
                "Content-Type": "application/json",
                "Accept": "application/json" // Optional, but can help indicate that you expect a JSON response
              }
            }
          )
            .then(res => {
              console.log(res);
            })
        }
      }
    ).render('#paypal-button-container');
  }
}
