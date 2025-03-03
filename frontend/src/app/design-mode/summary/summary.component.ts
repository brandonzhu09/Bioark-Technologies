import { Component, Input } from '@angular/core';
import { DesignFormService } from '../design-form.service';
import { CartService } from '../../services/cart.service';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PopupComponent } from '../../components/popup/popup.component';
import { ProductService } from '../../services/product.service';

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
    selector: 'design-summary',
    templateUrl: './summary.component.html',
    styleUrl: './summary.component.css',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, PopupComponent]
})
export class SummaryComponent {
    constructor(private designFormService: DesignFormService, private cartService: CartService, private productService: ProductService) {
    }

    @Input() product_name: string = 'Product Name';
    @Input() product_sku: string = 'CPD100000';
    @Input() function_type_name: string = 'CRISPRa';
    @Input() structure_type_name: string = 'Lenti-AIO';
    @Input() promoter_name: string = 'PCMV';
    @Input() protein_tag_name: string = 'None';
    @Input() fluorescene_marker_name: string = 'None';
    @Input() selection_marker_name: string = 'Puro';
    @Input() bacterial_marker_name: string = 'CAM';
    @Input() target_sequence: string = 'XXXXXX';

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

    ngOnChanges() {
        this.getDeliveryFormatTable();
    }

    addTestProduct() {
        // DELETE: add $1 test product
        this.cartService.addToCart(
            'CAM-C000K-XXXXXXl', 'product', 1, 'unit_size', 1, 1, 'Yes',
            this.function_type_name, this.structure_type_name, this.promoter_name,
            this.protein_tag_name, this.fluorescene_marker_name, this.selection_marker_name,
            this.bacterial_marker_name, this.target_sequence, 'delivery_format_name'
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
                let product_name = product_sku;

                this.cartService.addToCart(
                    product_sku, product_name, 1, unit_size, price, adjusted_price, ready_status,
                    this.function_type_name, this.structure_type_name, this.promoter_name,
                    this.protein_tag_name, this.fluorescene_marker_name, this.selection_marker_name,
                    this.bacterial_marker_name, this.target_sequence, delivery_format_name
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

    ngOnInit() {
        this.getDeliveryFormatTable();
        this.getProductSku();
    }

    getDeliveryFormatTable() {
        if (this.target_sequence !== null || this.target_sequence !== "IGNORE" || this.target_sequence !== "null") {
            this.designFormService
                .getDeliveryFormatTable(
                    this.structure_type_name,
                    this.function_type_name,
                    this.promoter_name,
                    this.protein_tag_name,
                    this.fluorescene_marker_name,
                    this.selection_marker_name,
                    this.bacterial_marker_name,
                    this.target_sequence
                )
                .subscribe((response) => {
                    if (response.length == 0) {
                        this.deliveryFormatTable = {};
                    } else {
                        this.deliveryFormatTable = response;
                        for (let deliveryFormat in this.deliveryFormatTable) {
                            this.deliveryFormatForm.addControl(deliveryFormat, new FormControl(0));
                        }
                    }
                });
        }
    }

    getProductSku() {
        if (this.target_sequence !== null || this.target_sequence !== "IGNORE" || this.target_sequence !== "null") {
            this.productService
                .getProductSku(
                    this.structure_type_name,
                    this.function_type_name,
                    this.promoter_name,
                    this.protein_tag_name,
                    this.fluorescene_marker_name,
                    this.selection_marker_name,
                    this.bacterial_marker_name,
                    this.target_sequence
                )
                .subscribe((response) => {
                    this.product_sku = response.product_sku;
                });
        }
    }

    showProtocol() {
        return (this.protein_tag_name !== 'Custom'
            && this.fluorescene_marker_name !== 'Custom'
            && this.selection_marker_name !== 'Custom'
            && this.bacterial_marker_name !== 'Custom'
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
}
