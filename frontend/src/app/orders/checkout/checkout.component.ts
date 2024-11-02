import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { ThisReceiver } from '@angular/compiler';
import { US_STATES } from '../../../../references';
import { OrderService } from '../../services/order.service';
import { CartService } from '../../services/cart.service';

declare var paypal_sdk: any;

interface ShippingPreview {
  name: string;
  address: string;
  cityStateZip: string;
}

interface OrderSummary {
  subtotal: number;
  tax: number | null;
  total: number | null;
}

@Component({
  selector: 'checkout-page',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatError, MatExpansionModule, MatIconModule, MatDividerModule, MatSelectModule],
})
export class CheckoutComponent {
  shippingForm: FormGroup;
  billingForm: FormGroup;
  isShippingPanelOpen = true;
  isShippingPanelDisabled = false;
  isBillingPanelDisabled = true;
  showShippingPreview = false;
  shippingPreview: ShippingPreview = {
    name: '',
    address: '',
    cityStateZip: ''
  };
  orderSummary: OrderSummary = {
    subtotal: 199.99, // Example subtotal - replace with your actual subtotal
    tax: null,
    total: null
  };
  states: any[] = US_STATES;
  cartItems: any[] = [];
  subTotal: number = 0;
  taxRate: number = 1;
  taxAmount: number = 0;
  totalPrice: number = 0;

  ngOnInit(): void {
    // this.initConfig();
    this.renderPayPalButton();
    this.getCartItems();
  }

  constructor(private fb: FormBuilder, private orderService: OrderService, private cartService: CartService) {
    this.shippingForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')]]
    });

    this.billingForm = this.fb.group({
      cardName: ['', Validators.required],
      cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
      expiryDate: ['', [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])\/([0-9]{2})$')]],
      cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3,4}$')]]
    });
  }

  getCartItems() {
    this.cartService.viewCart().subscribe((res) => {
      this.cartItems = res.data;
      this.subTotal = res.total_price;
    })
  }

  onShippingSubmit() {
    if (this.shippingForm.valid) {
      this.updateShippingPreview();
      this.isShippingPanelOpen = false;
      this.isShippingPanelDisabled = true;
      this.isBillingPanelDisabled = false;
      this.showShippingPreview = true;
      this.calculateSalesTax();
    } else {
      this.shippingForm.markAllAsTouched();
    }
  }

  updateShippingPreview() {
    const formValue = this.shippingForm.value;
    this.shippingPreview = {
      name: `${formValue.firstName} ${formValue.lastName}`,
      address: formValue.address,
      cityStateZip: `${formValue.city}, ${formValue.state} ${formValue.zipCode}`
    };
  }

  editShipping() {
    this.isShippingPanelOpen = true;
    this.isShippingPanelDisabled = false;
    this.isBillingPanelDisabled = true;
    this.showShippingPreview = false;
  }

  onBillingSubmit() {
    if (this.billingForm.valid) {
      // Handle billing submission
      console.log('Billing information submitted');
      // Add your payment processing logic here
    }
  }

  formatPrice(price: number | null): string {
    if (price === null) return '-';
    return price.toFixed(2);
  }

  calculateSalesTax() {
    this.orderService.calculateSalesTax(this.shippingForm.controls['zipCode'].value).subscribe(res => {
      this.taxRate = Number(res[0]["total_rate"]);
      this.taxAmount = this.subTotal * this.taxRate;
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
