import { Component, Input } from '@angular/core';
import { DesignFormService } from '../design-form.service';
import { CartService } from '../../services/cart.service';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
    imports: [ReactiveFormsModule, CommonModule]
})
export class SummaryComponent {
    productId = new FormControl("");
    quantityId = new FormControl(0);

    constructor(private designFormService: DesignFormService, private cartService: CartService) {
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

    ngOnChanges() {
        this.getDeliveryFormatTable();
    }

    addToCart() {
        if (this.productId.value != null && this.quantityId.value != null) {
            let product_sku = this.deliveryFormatTable[this.productId.value][this.quantityId.value].product_sku;
            let product_name = this.deliveryFormatTable[this.productId.value][this.quantityId.value].product_name;
            let unit_size = this.deliveryFormatTable[this.productId.value][this.quantityId.value].quantity;
            let price = this.deliveryFormatTable[this.productId.value][this.quantityId.value].price;
            let adjusted_price = this.deliveryFormatTable[this.productId.value][this.quantityId.value].adjusted_price;
            let ready_status = this.deliveryFormatTable[this.productId.value][this.quantityId.value].ready_status;
            let delivery_format_name = this.deliveryFormatTable[this.productId.value][this.quantityId.value].delivery_format_name;
            this.cartService.addToCart(product_sku, product_name,
                unit_size, price, adjusted_price, ready_status,
                this.function_type_name, this.structure_type_name, this.promoter_name,
                this.protein_tag_name, this.fluorescene_marker_name, this.selection_marker_name,
                this.bacterial_marker_name, this.target_sequence, delivery_format_name
            ).subscribe((res) => {
            })
        }
    }

    ngOnInit() {
        this.getDeliveryFormatTable()
        this.productId.valueChanges.subscribe(() => {
            this.quantityId.setValue(0);
        });
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
                    }
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

    getPrice(productId: any, quantityId: any) {
        if (this.deliveryFormatTable[productId] !== undefined) {
            let price = this.deliveryFormatTable[productId][quantityId]['price'];
            return price;
        }
        return 0;
    }
}
