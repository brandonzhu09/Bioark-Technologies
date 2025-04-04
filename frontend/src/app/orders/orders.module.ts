import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartComponent } from './cart/cart.component';
import { QuantityInputComponent } from '../components/quantity-input/quantity-input.component';
import { InvoiceCheckoutComponent } from './invoice-checkout/invoice-checkout.component';

@NgModule({
  declarations: [
    CartComponent,
    InvoiceCheckoutComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    CartComponent
  ]
})
export class OrdersModule { }
