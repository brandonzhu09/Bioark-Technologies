import { Component } from '@angular/core';

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrl: './order-page.component.css'
})
export class OrderPageComponent {

  isServicesOpen = false;
  isProductsOpen = false;

  toggleCollapse(section: 'services' | 'products') {
    if (section === 'services') {
      this.isServicesOpen = !this.isServicesOpen;
    } else if (section === 'products') {
      this.isProductsOpen = !this.isProductsOpen;
    }
  }

}
