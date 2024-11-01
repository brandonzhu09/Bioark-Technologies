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

  constructor(private fb: FormBuilder) {
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

  onShippingSubmit() {
    if (this.shippingForm.valid) {
      this.updateShippingPreview();
      this.isShippingPanelOpen = false;
      this.isShippingPanelDisabled = true;
      this.isBillingPanelDisabled = false;
      this.showShippingPreview = true;
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


}
