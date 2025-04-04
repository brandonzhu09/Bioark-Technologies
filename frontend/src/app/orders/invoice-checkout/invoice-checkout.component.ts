import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule, MatError } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { PrimaryButtonComponent } from '../../components/primary-button/primary-button.component';
import { HttpClient } from '@angular/common/http';
import { US_STATES } from '../../../../references';
import { environment } from '../../../environment/environment';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { CheckoutService } from '../../services/checkout.service';
import { OrderService } from '../../services/order.service';
import { ActivatedRoute, Router } from '@angular/router';

declare var paypal_sdk: any;

@Component({
  selector: 'app-invoice-checkout',
  templateUrl: './invoice-checkout.component.html',
  styleUrl: './invoice-checkout.component.css',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule,
    MatError, MatExpansionModule, MatIconModule, MatDividerModule, MatSelectModule,
    MatProgressSpinnerModule, PrimaryButtonComponent, MatTabsModule, MatButtonToggleModule, CommonModule]
})
export class InvoiceCheckoutComponent {
  billingAddressForm: FormGroup;
  isLoading = false;
  cardField: any;
  paypalButton: any;
  orderNumber: string = '';

  totalPrice: number = 0;
  invoiceNumber: string = '';
  billingDate: string = '';

  signupErrorMsg: string = '';
  paymentErrorMsg: string = '';

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.orderNumber = params.get('order-number')!;
      this.getInvoice(this.orderNumber);
    });
  }

  constructor(private fb: FormBuilder, private orderService: OrderService, private cartService: CartService, private route: ActivatedRoute,
    public authService: AuthService, private http: HttpClient, private router: Router, public checkoutService: CheckoutService) {

    this.billingAddressForm = this.fb.group({
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipcode: ['', [Validators.required, Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')]]
    });
  }

  getInvoice(orderNumber: string) {
    this.checkoutService.getInvoice(orderNumber).subscribe((res) => {
      this.totalPrice = Number(res.invoice.invoice_due);
      this.invoiceNumber = res.invoice.invoice_number;
      this.billingDate = this.formatDate(res.invoice.billing_date);
    })
  }

  formatPrice(price: number | null): string {
    if (price === null) return '-';
    return price.toFixed(2);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }

  ngAfterViewInit(): void {
    this.renderPayPalButton();
  }

  renderPayPalButton() {
    if (this.paypalButton) {
      this.paypalButton.close();
    }
    this.paypalButton = paypal_sdk.Buttons(
      {
        // Call your server to set up the transaction
        createOrder: this.createOrderCallback,
        // Call your server to finalize the transaction
        onApprove: this.onApproveCallback
      }
    ).render('#paypal-button-container');
    this.initCardFields();
  }

  createOrderCallback = () => {
    return fetch(
      `${environment.apiBaseUrl}/api/orders/create/`,
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json" // Optional, but can help indicate that you expect a JSON response
        },
        body: JSON.stringify({ total_price: this.totalPrice })
        // body: JSON.stringify({ total_price: this.subTotal + this.taxAmount })
      }
    )
      .then((res: any) => { return res.json(); })
      .then((order: any) => { console.log(order); console.log(order.id); return order.id; })
  }

  onApproveCallback = (data: any, actions: any) => {
    return fetch(`${environment.apiBaseUrl}/api/orders/capture/` + data.orderID, {
      method: 'post',
      headers: {
        "Content-Type": "application/json",
        'X-CSRFToken': this.authService.getCookie('csrftoken') || '',
        "Accept": "application/json" // Optional, but can help indicate that you expect a JSON response
      },
      credentials: 'include',
      body: JSON.stringify({
        address: null,
        total_price: this.totalPrice,
        order_number: this.orderNumber
      })
    }).then(function (res) {
      return res.json();
    }).then((orderData) => {
      console.log(orderData);
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
      // alert('Transaction ' + transaction.status + ': ' + transaction.id + '\n\nSee console for all available details');

      // Redirect to order confirmation page
      this.cartService.clearCart().subscribe(() => {
        this.router.navigate(['/order-confirmation', transaction.id]).then(() => {
          window.location.reload();
        });
      });
    }
    ).catch((error: any) => {
      console.log(error);
    }).finally(() => {
      this.isLoading = false;
    });
  }

  initCardFields = () => {
    this.cardField = paypal_sdk.CardFields({
      createOrder: this.createOrderCallback,
      onApprove: this.onApproveCallback,
      style: {
        input: {
          "font-size": "16px",
          "font-family": "courier, monospace",
          "font-weight": "lighter",
          color: "#ccc",
        },
        ".invalid": { color: "purple" },
      },
    });

    console.log(this.cardField.isEligible());

    if (this.cardField.isEligible()) {

      const nameField = this.cardField.NameField({
        style: { input: { color: "blue" }, ".invalid": { color: "purple" } },
      });
      nameField.render("#card-name-field-container");

      const numberField = this.cardField.NumberField({
        style: { input: { color: "blue" } },
      });
      numberField.render("#card-number-field-container");

      const cvvField = this.cardField.CVVField({
        style: { input: { color: "blue" } },
      });
      cvvField.render("#card-cvv-field-container");

      const expiryField = this.cardField.ExpiryField({
        style: { input: { color: "blue" } },
      });
      expiryField.render("#card-expiry-field-container");
    }
  }

  checkoutOrder = () => {
    if (this.totalPrice > 0) {
      this.paymentErrorMsg = '';
      this.submitCardField();
    }
  }

  submitCardField = () => {
    this.isLoading = true;
    this.cardField.submit()
      .then(() => {
        // submit successful
      })
      .catch((error: any) => {
        this.paymentErrorMsg = 'An error occurred while processing your card. Please try again.';

        console.log(error);
        console.log(error.details);
        console.log(error.message);

        if (error.message == "INVALID_NUMBER") {
          this.paymentErrorMsg = 'Invalid card number. Please check and try again.';
        }
        else if (error.message == "INVALID_CVV") {
          this.paymentErrorMsg = 'Invalid CCV. Please check and try again.';
        }
        else if (error.message == "INVALID_EXPIRY") {
          this.paymentErrorMsg = 'Invalid expiry date. Please check and try again.';
        }
      })
      .finally(() => {
        this.isLoading = false;
      });

  }


}
