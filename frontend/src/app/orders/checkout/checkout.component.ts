import { Component } from '@angular/core';

declare var paypal: any;

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
    paypal.Buttons({
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: this.totalAmount.toFixed(2)  // Dynamically pass the total amount
            }
          }]
        });
      },
      onApprove: (data: any, actions: any) => {
        return actions.order.capture().then(details => {
          alert('Transaction completed by ' + details.payer.name.given_name);
          // Optionally, navigate to a success page or update the UI here
        });
      }
    }).render('#paypal-button-container'); // Render the PayPal button in the specified div
  }
}
