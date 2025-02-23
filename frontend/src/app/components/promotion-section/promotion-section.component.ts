import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'promotion-section',
  templateUrl: './promotion-section.component.html',
  styleUrl: './promotion-section.component.css'
})
export class PromotionSectionComponent {
  products: any[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.productService.getLatestFeaturedProducts().subscribe(res => {
      this.products = res;
    })
  }

}
