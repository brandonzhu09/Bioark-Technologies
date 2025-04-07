import { AfterViewInit, Component, ViewChild } from '@angular/core';
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
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { CommonModule } from '@angular/common';


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
    MatProgressSpinnerModule, PrimaryButtonComponent, MatTabsModule, MatButtonToggleModule, CommonModule],
})
export class CheckoutComponent implements AfterViewInit {
  @ViewChild('paymentTabGroup') paymentTabGroup!: MatTabGroup;

  signupForm: FormGroup;
  shippingForm: FormGroup;
  billingAddressForm: FormGroup;
  purchaseOrderForm: FormGroup;
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
  cardFieldPO: any;
  paypalButton: any;
  paypalButtonPO: any;

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
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      address_line_1: ['', Validators.required],
      apt: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipcode: ['', [Validators.required, Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')]]
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
        first_name: res.first_name,
        last_name: res.last_name,
        address_line_1: res.shipping_address.address_line_1,
        apt: res.shipping_address.apt_suite,
        city: res.shipping_address.city,
        state: res.shipping_address.state,
        zipcode: res.shipping_address.zipcode
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
      name: `${formValue.first_name} ${formValue.last_name}`,
      address: formValue.address_line_1,
      cityStateZip: `${formValue.city}, ${formValue.state} ${formValue.zipcode}`
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
    this.orderService.calculateSalesTax(this.shippingForm.controls['zipcode'].value).subscribe(res => {
      this.taxRate = Number(res[0]["total_rate"]);
      this.taxAmount = this.subTotal * this.taxRate;
      this.taxAmount = parseFloat(this.taxAmount.toFixed(2));
    })
  }

  ngAfterViewInit(): void {
    this.renderPayPalButton();
  }

  renderPayPalButton() {
    setTimeout(() => {
      const paypalContainer = document.getElementById('paypal-button-container');
      if (paypalContainer) {
        paypalContainer.innerHTML = ''; // Clear the container
  
        this.paypalButton = paypal_sdk.Buttons({
          createOrder: this.createOrderCallback,
          onApprove: this.onApproveCallback,
        }).render('#paypal-button-container');
  
        this.initCardFields();
      } else {
        console.error('PayPal button container does not exist in the DOM.');
      }
    }, 0); // Delay execution to allow DOM updates
  }

  renderPayPalButtonInPO() {
    setTimeout(() => {
      const paypalContainer = document.getElementById('paypal-button-container-po');
      if (paypalContainer) {
        paypalContainer.innerHTML = ''; // Clear the container
  
        this.paypalButtonPO = paypal_sdk.Buttons({
          createOrder: this.createOrderCallback,
          onApprove: this.onApprovePOCallback,
        }).render('#paypal-button-container-po');
  
        this.initCardFieldsInPO();
      } else {
        console.error('PayPal button container does not exist in the DOM.');
      }
    }, 0); // Delay execution to allow DOM updates
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

  initCardFieldsInPO = () => {
    this.cardFieldPO = paypal_sdk.CardFields({
      createOrder: this.createOrderCallback,
      onApprove: this.onApprovePOCallback,
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

    if (this.cardFieldPO.isEligible()) {

      const nameField = this.cardFieldPO.NameField({
        style: { input: { color: "blue" }, ".invalid": { color: "purple" } },
      });
      nameField.render("#card-name-field-container-po");

      const numberField = this.cardFieldPO.NumberField({
        style: { input: { color: "blue" } },
      });
      numberField.render("#card-number-field-container-po");

      const cvvField = this.cardFieldPO.CVVField({
        style: { input: { color: "blue" } },
      });
      cvvField.render("#card-cvv-field-container-po");

      const expiryField = this.cardFieldPO.ExpiryField({
        style: { input: { color: "blue" } },
      });
      expiryField.render("#card-expiry-field-container-po");
    }
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
        address: this.shippingForm.value,
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

  onApprovePOCallback = (data: any, actions: any) => {
    if (!this.purchaseOrderForm.valid) {
      this.paymentErrorMsg = 'Please fill in all required Purchase Order (PO) fields.';
      return;
    }
    const formData = new FormData();
    formData.append('order_number', this.purchaseOrderForm.controls['order_number'].value);
    formData.append('po_file', this.purchaseOrderForm.controls['po_file'].value, this.purchaseOrderForm.controls['po_file'].value.name);
    formData.append('cart', JSON.stringify(this.cartItems));
    formData.append('quantity', this.quantity.toString());
    formData.append('subtotal', this.subTotal.toString());
    formData.append('shipping_amount', this.shippingFee.toString());
    formData.append('tax_amount', this.taxAmount.toString());
    formData.append('total_price', this.totalPrice.toString());
    console.log(JSON.stringify(this.shippingForm.value));
    formData.append('address', JSON.stringify(this.shippingForm.value));
    formData.append('credit_price', this.creditPrice.toString());
    formData.append('po_price', this.poPrice.toString());

    return fetch(`${environment.apiBaseUrl}/api/orders/capture/po/` + data.orderID, {
      method: 'post',
      headers: {
        'X-CSRFToken': this.authService.getCookie('csrftoken') || '',      
      },
      credentials: 'include',
      body: formData,
      
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

  checkoutOrder = () => {
    if (this.totalPrice > 0) {
      this.paymentErrorMsg = '';

      if (this.paymentTabGroup.selectedIndex === 0) {
        this.submitCardField();
      }

      else if (this.purchaseOrderForm.valid && this.paymentTabGroup.selectedIndex === 1 && this.totalPrice >= 100 && this.totalPrice < 1000) {
        const po_data = {
          order_number: this.purchaseOrderForm.controls['order_number'].value,
          po_file: this.purchaseOrderForm.controls['po_file'].value,
          cart: this.cartItems,
          quantity: this.quantity,
          subtotal: this.subTotal,
          shipping_amount: this.shippingFee,
          tax_amount: this.taxAmount,
          total_price: this.totalPrice,
          address: this.shippingForm.value,
          credit_price: this.creditPrice,
          po_price: this.poPrice
        }

        let payment_token = '';
        this.checkoutService.payWithPurchaseOrder(po_data).subscribe((res) => {
          this.cartService.clearCart().subscribe(() => {
            this.router.navigate(['/order-confirmation', payment_token]).then(() => {
              window.location.reload();
            });
          });
        });
      }

      else if (this.purchaseOrderForm.valid && this.paymentTabGroup.selectedIndex === 1 && this.totalPrice >= 1000) {
        this.submitCardFieldInPO();
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

  submitCardFieldInPO = () => {
    this.isLoading = true;
    this.cardFieldPO.submit()
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
    this.renderPayPalButtonInPO();
  }

  updatePricingForPOSplit() {
    this.poPrice = Number((this.totalPrice / 2).toFixed(2));
    this.creditPrice = this.totalPrice - this.poPrice;
    this.renderPayPalButtonInPO();
  }

  onPaymentTabChange(selectedIndex: number) {
    if (selectedIndex === 0) {
      this.updatePricingForCredit();
    } else if (selectedIndex === 1) {
      if (this.totalPrice >= 100 && this.totalPrice < 1000) {
        this.updatePricingForPO();
      }
      else if (this.totalPrice >= 1000) {
        this.updatePricingForPOSplit();
      }
    }
  }

}