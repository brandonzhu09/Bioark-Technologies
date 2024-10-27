import { Component, OnInit } from '@angular/core';
import {
  IPayPalConfig,
  ICreateOrderRequest
} from 'ngx-paypal';
import { CartService } from '../../services/cart.service';

declare var paypal_sdk: any;

@Component({
  selector: 'order-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {

  public payPalConfig?: IPayPalConfig;
  cartItems: any[] = [];

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    // this.initConfig();
    this.renderPayPalButton();
    this.viewCart();
  }

  viewCart() {
    this.cartService.viewCart().subscribe((res) => {
      this.cartItems = res.data;
    })
  }

  renderPayPalButton() {
    paypal_sdk.Buttons(
      {
        // Call your server to set up the transaction
        createOrder: function () {
          return fetch(
            "http://localhost:8000/orders/create/",
            {
              method: "post",
              headers: {
                "Content-Type": "application/json",
                "Accept": "application/json" // Optional, but can help indicate that you expect a JSON response
              },
              body: JSON.stringify({
                cart: [
                  {
                    id: "YOUR_PRODUCT_ID",
                    quantity: "YOUR_PRODUCT_QUANTITY",
                  },
                ],
              }),
            }
          )
            .then((res: any) => { return res.json(); })
            .then((order: any) => { console.log(order); console.log(order.id); return order.id; })
        },
        // Call your server to finalize the transaction
        onApprove: function (data: any, actions: any) {
          return fetch("http://localhost:8000/orders/capture/" + data.orderID, {
            method: 'post'
          }).then(function (res) {
            return res.json();
          }).then(function (orderData) {
            // Three cases to handle:
            //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
            //   (2) Other non-recoverable errors -> Show a failure message
            //   (3) Successful transaction -> Show confirmation or thank you

            // This example reads a v2/checkout/orders capture response, propagated from the server
            // You could use a different API or structure for your 'orderData'
            var errorDetail = Array.isArray(orderData.details) && orderData.details[0];

            if (errorDetail && errorDetail.issue === 'INSTRUMENT_DECLINED') {
              return actions.restart(); // Recoverable state, per:
              // https://developer.paypal.com/docs/checkout/integration-features/funding-failure/
            }

            if (errorDetail) {
              var msg = 'Sorry, your transaction could not be processed.';
              if (errorDetail.description) msg += '\n\n' + errorDetail.description;
              if (orderData.debug_id) msg += ' (' + orderData.debug_id + ')';
              return alert(msg); // Show a failure message (try to avoid alerts in production environments)
            }

            // Successful capture! For demo purposes:
            console.log('Capture result', orderData, JSON.stringify(orderData, null, 2));
            var transaction = orderData.purchase_units[0].payments.captures[0];
            alert('Transaction ' + transaction.status + ': ' + transaction.id + '\n\nSee console for all available details');

            // Replace the above to show a success message within this page, e.g.
            // const element = document.getElementById('paypal-button-container');
            // element.innerHTML = '';
            // element.innerHTML = '<h3>Thank you for your payment!</h3>';
            // Or go to another URL:  actions.redirect('thank_you.html');
          });
        }
      }
    ).render('#paypal-button-container');
  }
}
