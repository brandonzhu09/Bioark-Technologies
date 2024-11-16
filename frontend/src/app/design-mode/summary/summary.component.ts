import { Component, Input } from '@angular/core';
import { DesignFormService } from '../design-form.service';
import { CartService } from '../../services/cart.service';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'design-summary',
    templateUrl: './summary.component.html',
    styleUrl: './summary.component.css',
    standalone: true,
    imports: [ReactiveFormsModule]
})
export class SummaryComponent {
    productId = new FormControl(-1);

    constructor(private designFormService: DesignFormService, private cartService: CartService) {
    }

    @Input() product_name: string = 'Product Name';
    @Input() product_sku: string = 'CPD100000';
    @Input() function_type_name: string = 'CRISPRa';
    @Input() structure_type_name: string = 'Standard';
    @Input() delivery_type_name: string = 'Standard';
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
    deliveryFormatTable: any[] = [];

    ngOnChanges() {
        this.getDeliveryFormatTable();
    }

    addToCart() {
        if (this.productId.value != -1 && this.productId.value != null) {
            let product_sku = this.deliveryFormatTable[this.productId.value]['product_sku'];
            let product_name = this.deliveryFormatTable[this.productId.value]['product_name'];
            let unit_size = this.deliveryFormatTable[this.productId.value]['quantity'];
            let price = this.deliveryFormatTable[this.productId.value]['price'];
            let adjusted_price = this.deliveryFormatTable[this.productId.value]['adjusted_price'];
            let ready_status = this.deliveryFormatTable[this.productId.value]['ready_status'];
            this.cartService.addToCart(product_sku, product_name, unit_size, price, adjusted_price, ready_status).subscribe((res) => {
                console.log(res);
            })
        }
    }

    ngOnInit() {
        this.getDeliveryFormatTable()
    }

    getDeliveryFormatTable() {
        console.log(this.target_sequence)
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
                        this.deliveryFormatTable = [];
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
}
