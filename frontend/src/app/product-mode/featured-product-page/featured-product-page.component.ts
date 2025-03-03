import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environment/environment';
import { CartService } from '../../services/cart.service';

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
  mainImage: string = '../../../assets/placeholder-card.jpg';
  price: number = 0;
  quantity: number = 1;
  unit_size_id: number = 0;
  showPopup: boolean = false;
  cartItems: any = [];

  constructor(private productService: ProductService, private route: ActivatedRoute, private cartService: CartService) { }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  changeMainImage(imageUrl: string) {
    this.mainImage = imageUrl;
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
      this.mainImage = environment.apiBaseUrl + this.images[0].image;
      this.manuals = res.manuals;
      this.unit_prices = res.unit_prices;

      this.price = this.unit_prices[0].price;
      this.unit_size_id = this.unit_prices[0].id;
    })
  }

  fullUrl(url: string): string {
    return environment.apiBaseUrl + url;
  }

  selectUnitSize(unit_size_id: number, price: number) {
    this.unit_size_id = unit_size_id;
    this.price = price;
  }

  onQuantityChange(quantity: number) {
    this.quantity = quantity;
  }

  addToCart() {
    const unit_size = this.unit_prices.find((up) => up.id === this.unit_size_id)?.unit_size;
    const totalPrice = this.price * this.quantity;
    this.cartService.addToCart(this.catalog_number, this.product_name, this.quantity, unit_size, totalPrice, totalPrice, 'Yes').subscribe((res) => { });

    this.cartItems = [{ 'product_sku': this.product_name, 'quantity': unit_size }];
    this.showPopup = false;
    setTimeout(() => {
      this.showPopup = this.cartItems.length > 0;
    }, 0);
  }
}
