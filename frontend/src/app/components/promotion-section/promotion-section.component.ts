import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { environment } from '../../../environment/environment';

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

  fullUrl(url: string) {
    return environment.apiBaseUrl + url;
  }

}
