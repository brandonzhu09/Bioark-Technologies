import { AfterViewInit, Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ThisReceiver } from '@angular/compiler';
import { US_STATES } from '../../../../references';
import { OrderService } from '../../services/order.service';
import { CartService } from '../../services/cart.service';
import { PrimaryButtonComponent } from '../../components/primary-button/primary-button.component';
import { AuthService } from '../../services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environment/environment';
import { CheckoutService } from '../../services/checkout.service';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

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
  imports: [FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule,
    MatError, MatExpansionModule, MatIconModule, MatDividerModule, MatSelectModule,
    MatProgressSpinnerModule, PrimaryButtonComponent, MatTabsModule, MatButtonToggleModule],
})
export class CheckoutComponent implements AfterViewInit {
  signupForm: FormGroup;
  shippingForm: FormGroup;
  billingAddressForm: FormGroup;
  purchaseOrderForm: FormGroup;
  paymentOption: FormControl;
  isSignupPanelOpen = false;
  isSignupPanelDisabled = true;
  isShippingPanelOpen = true;
  isShippingPanelDisabled = false;
  isBillingPanelDisabled = true;
  showSignupPreview = false;
  showShippingPreview = false;
  isLoading = false;
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
  quantity: number = 0;
  shippingFee: number = 0;
  discountCode: string = '';
  cardField: any;
  paypalButton: any;

  signupErrorMsg: string = '';
  paymentErrorMsg: string = '';

  // Credit & PO (Purchase Order) related variables
  creditPrice: number = 0;
  poPrice: number = 0;

  ngOnInit(): void {
    this.getCartItems();
    this.autoFillShippingForm();
  }

  constructor(private fb: FormBuilder, private orderService: OrderService, private cartService: CartService,
    public authService: AuthService, private http: HttpClient, private router: Router, public checkoutService: CheckoutService) {
    // open sign up form if user is not logged in
    this.authService.getSession().subscribe((response) => {
      if (response.isAuthenticated) {
        this.isShippingPanelOpen = true;
        this.isShippingPanelDisabled = false;
      }
      else {
        this.isSignupPanelOpen = true;
        this.isSignupPanelDisabled = false;
        this.isShippingPanelOpen = false;
        this.isShippingPanelDisabled = true;
      }

    })

    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    })

    this.shippingForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      apt: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')]]
    });

    this.billingAddressForm = this.fb.group({
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipcode: ['', [Validators.required, Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')]]
    });

    this.purchaseOrderForm = this.fb.group({
      order_number: ['', Validators.required],
      po_file: [null, Validators.required]
    })

    this.paymentOption = new FormControl('credit', Validators.required);
  }

  getCartItems() {
    this.cartService.viewCart().subscribe((res) => {
      this.cartItems = res.data;
      this.subTotal = res.total_price;
      this.quantity = res.count;
      this.shippingFee = this.checkoutService.calculateShippingFee(this.subTotal);
      this.totalPrice = this.subTotal + this.shippingFee;
      this.creditPrice = this.totalPrice;
    })
  }

  autoFillShippingForm() {
    this.authService.getUserInfo().subscribe((res) => {
      this.shippingForm.patchValue({
        firstName: res.first_name,
        lastName: res.last_name,
        address: res.shipping_address.address_line_1,
        apt: res.shipping_address.apt_suite,
        city: res.shipping_address.city,
        state: res.shipping_address.state,
        zipCode: res.shipping_address.zipcode
      });
    })
  }

  onSignupSubmit() {
    if (this.signupForm.valid) {
      this.authService.signup(this.signupForm.value).subscribe(res => {
        this.signupErrorMsg = '';
        alert('Email verification link sent. Please check your email and verify your account. You may now exit this page.');
      }, err => {
        this.signupErrorMsg = err.error.detail;
      })
      // this.isSignupPanelOpen = false;
      // this.isSignupPanelDisabled = true;
      // this.isShippingPanelOpen = true;
      // this.isShippingPanelDisabled = false;
      // this.showSignupPreview = true;
    } else {
      this.signupForm.markAllAsTouched();
    }
  }

  onShippingSubmit() {
    if (this.shippingForm.valid) {
      this.updateShippingPreview();
      this.isShippingPanelOpen = false;
      this.isShippingPanelDisabled = true;
      this.isBillingPanelDisabled = false;
      this.showSignupPreview = true;
      this.showShippingPreview = true;
      // this.calculateSalesTax();
    }
    // else {
    //   this.shippingForm.markAllAsTouched();
    // }
  }

  updateShippingPreview() {
    const formValue = this.shippingForm.value;
    this.shippingPreview = {
      name: `${formValue.firstName} ${formValue.lastName}`,
      address: formValue.address,
      cityStateZip: `${formValue.city}, ${formValue.state} ${formValue.zipCode}`
    };
  }

  editSignup() {
    this.isSignupPanelOpen = true;
    this.isSignupPanelDisabled = false;
    this.isShippingPanelDisabled = true;
    this.showSignupPreview = false;
    this.showShippingPreview = false;
  }

  editShipping() {
    this.isShippingPanelOpen = true;
    this.isShippingPanelDisabled = false;
    this.isBillingPanelDisabled = true;
    this.showShippingPreview = false;
    this.showSignupPreview = false;
  }

  formatPrice(price: number | null): string {
    if (price === null) return '-';
    return price.toFixed(2);
  }

  calculateSalesTax() {
    this.orderService.calculateSalesTax(this.shippingForm.controls['zipCode'].value).subscribe(res => {
      this.taxRate = Number(res[0]["total_rate"]);
      this.taxAmount = this.subTotal * this.taxRate;
      this.taxAmount = parseFloat(this.taxAmount.toFixed(2));
    })
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
        body: JSON.stringify({ total_price: this.creditPrice })
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
        address: {
          address_line_1: this.shippingForm.controls["address"].value,
          city: this.shippingForm.controls["city"].value,
          state: this.shippingForm.controls["state"].value,
          zipcode: this.shippingForm.controls["zipCode"].value
        },
        cart: this.cartItems,
        quantity: this.quantity,
        discount_code: this.discountCode,
        subtotal: this.subTotal,
        tax_amount: this.taxAmount,
        shipping_amount: this.shippingFee,
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
    if (this.paymentOption.valid && this.totalPrice > 0) {
      this.paymentErrorMsg = '';

      if (this.paymentOption.value === 'credit') {
        this.submitCardField();
      }

      else if (this.purchaseOrderForm.valid && (this.paymentOption.value === 'po' || this.paymentOption.value === 'split')) {
        const po_data = {
          order_number: this.purchaseOrderForm.controls['order_number'].value,
          po_file: this.purchaseOrderForm.controls['po_file'].value,
          cart: this.cartItems,
          quantity: this.quantity,
          subtotal: this.subTotal,
          shipping_amount: this.shippingFee,
          tax_amount: this.taxAmount,
          total_price: this.totalPrice,
          address: {
            address_line_1: this.shippingForm.controls["address"].value,
            city: this.shippingForm.controls["city"].value,
            state: this.shippingForm.controls["state"].value,
            zipcode: this.shippingForm.controls["zipCode"].value
          },
          credit_price: this.creditPrice,
          po_price: this.poPrice
        }

        let payment_token = '';
        this.checkoutService.payWithPurchaseOrder(po_data).subscribe((res) => {
          payment_token = res.payment_token;
          if (this.paymentOption.value === 'split' && this.totalPrice > 1000) {
            // this.submitCardField();
          }
          else if (this.paymentOption.value === 'po') {
            // Redirect to order confirmation page
            this.cartService.clearCart().subscribe(() => {
              this.router.navigate(['/order-confirmation', payment_token]).then(() => {
                window.location.reload();
              });
            });
          }
        });
      }

      else {
        this.paymentErrorMsg = 'An error has occurred. Please make sure to fill in all required fields.';
      }

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

  onPOFileUpload = (event: any) => {
    const file = event.target.files[0];
    this.purchaseOrderForm.controls['po_file'].setValue(file);
  }

  updatePricingForCredit() {
    this.creditPrice = this.totalPrice;
    this.renderPayPalButton();
  }

  updatePricingForPO() {
    this.poPrice = this.totalPrice;
    this.creditPrice = 0;
    this.renderPayPalButton();
  }

  updatePricingForPOSplit() {
    this.poPrice = Number((this.totalPrice / 2).toFixed(2));
    this.creditPrice = this.totalPrice - this.poPrice;
    this.renderPayPalButton();

    console.log(this.poPrice, this.creditPrice);
  }

}