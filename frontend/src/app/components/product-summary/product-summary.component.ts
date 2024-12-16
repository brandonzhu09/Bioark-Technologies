import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-summary',
  templateUrl: './product-summary.component.html',
  styleUrl: './product-summary.component.css'
})
export class ProductSummaryComponent {
  product_name: string = 'Product Name';
  product_sku: string | null = 'CPD100000';
  function_type_name: string = 'CRISPRa';
  structure_type_name: string = 'Standard';
  promoter_name: string = 'PCMV';
  protein_tag_name: string = 'None';
  fluorescene_marker_name: string = 'None';
  selection_marker_name: string = 'Puro';
  bacterial_marker_name: string = 'CAM';
  target_sequence: string = 'XXXXXX';

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.product_sku = params.get('product_sku');
    });
  }

  getProductDetails() {

  }

}
