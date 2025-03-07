import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { BehaviorSubject, combineLatest, filter, skip } from 'rxjs';
import { DesignFormService } from '../../design-mode/design-form.service';
import { FormGroup, FormControl } from '@angular/forms';
import { CartService } from '../../services/cart.service';

interface DeliveryFormat {
  product_sku: string;
  delivery_format_name: string;
  product_format_description: string;
  product_name: string;
  quantity: string;
  price: string;
  adjusted_price: string;
  ready_status: string;
}

@Component({
  selector: 'app-product-summary',
  templateUrl: './product-summary.component.html',
  styleUrl: './product-summary.component.css'
})
export class ProductSummaryComponent implements OnInit {
  product_sku: string | null = '';

  product_name$ = new BehaviorSubject<string>('');
  function_type_name$ = new BehaviorSubject<string>('');
  structure_type_name$ = new BehaviorSubject<string>('');
  promoter_name$ = new BehaviorSubject<string>('');
  protein_tag_name$ = new BehaviorSubject<string>('');
  fluorescene_marker_name$ = new BehaviorSubject<string>('');
  selection_marker_name$ = new BehaviorSubject<string>('');
  bacterial_marker_name$ = new BehaviorSubject<string>('');
  target_sequence$ = new BehaviorSubject<string>('');
  delivery_format_name$ = new BehaviorSubject<string>('');

  product: any;
  deliveryFormatColumns: string[] = [
    'delivery_format_name',
    'product_format_description',
    'product_name',
    'quantity',
    'price',
  ];
  deliveryFormatTable: { [key: string]: DeliveryFormat[] } = {};
  deliveryFormatForm = new FormGroup({});
  showPopup = false;
  cartItems: any = [];

  constructor(private route: ActivatedRoute, private productService: ProductService,
    private designFormService: DesignFormService, private cartService: CartService, private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.product_sku = params.get('product-sku')!;
      this.getProductDetails()
    });
  }

  getProductDetails() {
    if (!this.product_sku) return;

    return this.productService.getProductDetails(this.product_sku).subscribe((data) => {
      // Updating BehaviorSubjects
      this.product_name$.next(data.product_name);
      this.function_type_name$.next(data.function_type_name);
      this.structure_type_name$.next(data.structure_type_name);
      this.promoter_name$.next(data.promoter_name);
      this.protein_tag_name$.next(data.protein_tag_name);
      this.fluorescene_marker_name$.next(data.fluorescene_marker_name);
      this.selection_marker_name$.next(data.selection_marker_name);
      this.bacterial_marker_name$.next(data.bacterial_marker_name);
      this.target_sequence$.next(data.target_sequence);
      this.delivery_format_name$.next(data.delivery_format_name);

      this.getDeliveryFormatTable();

    });

  }

  ngOnChanges() {
    this.getDeliveryFormatTable();
  }

  getDeliveryFormatTable() {
    if (this.target_sequence$.value !== null || this.target_sequence$.value !== "IGNORE" || this.target_sequence$.value !== "null") {
      this.designFormService
        .getDeliveryFormatTable(
          this.structure_type_name$.value,
          this.function_type_name$.value,
          this.promoter_name$.value,
          this.protein_tag_name$.value,
          this.fluorescene_marker_name$.value,
          this.selection_marker_name$.value,
          this.bacterial_marker_name$.value,
          this.target_sequence$.value
        )
        .subscribe((response) => {
          if (response.length == 0) {
            this.deliveryFormatTable = {};
          } else {
            this.deliveryFormatTable = response;
            for (let deliveryFormat in this.deliveryFormatTable) {
              this.deliveryFormatForm.addControl(deliveryFormat, new FormControl(0));
              this.deliveryFormatForm.addControl(deliveryFormat, new FormControl(0));
            }
          }
        });
    }
  }

  addTestProduct() {
    // DELETE: add $1 test product
    this.cartService.addToCart(
      'TEST_SKU', 'product', 1, 'unit_size', 1, 1, 'Yes',
      this.function_type_name$.value, this.structure_type_name$.value, this.promoter_name$.value,
      this.protein_tag_name$.value, this.fluorescene_marker_name$.value, this.selection_marker_name$.value,
      this.bacterial_marker_name$.value, this.target_sequence$.value, 'delivery_format_name'
    ).subscribe((res) => { });
  }

  addToCart() {
    let items: any = [];
    for (let key in this.deliveryFormatForm.controls) {
      let quantityId = this.deliveryFormatForm.get(key)?.value;
      if (quantityId === true) {
        quantityId = '0'; // Set quantityId to '0' if it is true
      }
      if (quantityId !== false && quantityId !== 0 || (typeof quantityId === 'string' && !isNaN(Number(quantityId)))) {
        let product_sku = this.deliveryFormatTable[key][quantityId].product_sku;
        let unit_size = this.deliveryFormatTable[key][quantityId].quantity;
        let price = Number(this.deliveryFormatTable[key][quantityId].price);
        let adjusted_price = Number(this.deliveryFormatTable[key][quantityId].adjusted_price);
        let ready_status = this.deliveryFormatTable[key][quantityId].ready_status;
        let delivery_format_name = this.deliveryFormatTable[key][quantityId].delivery_format_name;
        let product_name = this.deliveryFormatTable[key][quantityId].product_name;

        this.cartService.addToCart(
          product_sku, product_name, 1, unit_size, price, adjusted_price, ready_status,
          this.function_type_name$.value, this.structure_type_name$.value, this.promoter_name$.value,
          this.protein_tag_name$.value, this.fluorescene_marker_name$.value, this.selection_marker_name$.value,
          this.bacterial_marker_name$.value, this.target_sequence$.value, delivery_format_name
        ).subscribe((res) => { });

        items.push(this.deliveryFormatTable[key][quantityId]);
      }
    }
    this.cartItems = items;
    this.showPopup = false;
    setTimeout(() => {
      this.showPopup = this.cartItems.length > 0;
    }, 0);
  }

  showProtocol() {
    return (this.protein_tag_name$.value !== 'Custom'
      && this.fluorescene_marker_name$.value !== 'Custom'
      && this.selection_marker_name$.value !== 'Custom'
      && this.bacterial_marker_name$.value !== 'Custom'
    )
  }

  getPrice(deliveryFormat: any) {
    let quantityId = this.deliveryFormatForm.get(deliveryFormat)?.value;
    quantityId = (quantityId === true || quantityId === false) ? '0' : quantityId;
    let price = this.deliveryFormatTable[deliveryFormat][quantityId]['price'];
    return price;
  }

  getFormControl(key: string): FormControl {
    return this.deliveryFormatForm.get(key) as FormControl;
  }

  goToConsult() {
    this.router.navigate(['/quote'])
  }

}
function switchMap(arg0: (params: any) => void): import("rxjs").OperatorFunction<import("@angular/router").ParamMap, unknown> {
  throw new Error('Function not implemented.');
}

