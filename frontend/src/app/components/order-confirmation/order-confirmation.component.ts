import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrl: './order-confirmation.component.css'
})
export class OrderConfirmationComponent {
  token: string = '';

  subtotal: string = '';
  shipping_amount: string = '';
  tax_amount: string = '';
  total_price: string = '';
  payment_source: string = '';
  last_digits: string = '';
  order_placed_date: string = '';
  delivery_date: string = '';
  first_name: string = '';
  last_name: string = '';
  email: string = '';

  shipping_address: any;
  billing_address: any;

  constructor(private route: ActivatedRoute, private userService: UserService) {
    this.route.params.subscribe(params => {
      this.token = params['token'];
      this.viewOrder();
    });
  }

  viewOrder() {
    this.userService.viewOrder(this.token).subscribe(
      (res) => {
        this.subtotal = res.subtotal;
        this.shipping_amount = res.shipping_amount;
        this.tax_amount = res.tax_amount;
        this.total_price = res.total_price;
        this.payment_source = res.payment_source;
        this.last_digits = res.last_digits;
        this.shipping_address = res.shipping_address;
        this.billing_address = res.billing_address;
        this.first_name = res.user.first_name;
        this.last_name = res.user.last_name;
        this.email = res.user.email;
        this.order_placed_date = this.formatDate(res.order_placed_date);
        // TODO: replace this
        this.delivery_date = 'Sat, May 10'

      }
    )
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }

}
