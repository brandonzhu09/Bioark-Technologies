import { Component, inject } from '@angular/core';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {
  private productService = inject(ProductService);

  productsData = this.productService.get_products();
}
