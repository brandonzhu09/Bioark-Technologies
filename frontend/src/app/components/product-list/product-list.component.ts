import { Component, inject, Input } from '@angular/core';
import { LandingPageService } from '../../services/landing.service';

@Component({
  selector: 'product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {
  private productService = inject(LandingPageService);
  productsData = this.productService.get_products();
}
