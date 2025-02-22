import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environment/environment';

@Component({
  selector: 'app-featured-product-page',
  templateUrl: './featured-product-page.component.html',
  styleUrl: './featured-product-page.component.css'
})
export class FeaturedProductPageComponent {
  catalog_number: string = '';
  product_name: string = '';
  description: string = '';
  key_features: string = '';
  performance_data: string = '';
  storage_info: string = '';
  ship_info: string = '';
  images: any[] = [];
  manuals: any[] = [];
  unit_prices: any[] = [];

  activeTab: string = 'specifications';

  constructor(private productService: ProductService, private route: ActivatedRoute) { }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.catalog_number = params.get('catalog-number')!;
      this.loadFeaturedProductPage();
    });
  }

  loadFeaturedProductPage() {

    this.productService.loadFeaturedProductPage(this.catalog_number).subscribe(res => {
      this.product_name = res.product_name;
      this.description = res.description;
      this.key_features = res.key_features;
      this.performance_data = res.performance_data;
      this.storage_info = res.storage_info;
      this.ship_info = res.ship_info;
      this.images = res.images;
      this.manuals = res.manuals;
      this.unit_prices = res.unit_prices;
    })
  }

  fullUrl(url: string): string {
    return environment.apiBaseUrl + url;
  }

}
