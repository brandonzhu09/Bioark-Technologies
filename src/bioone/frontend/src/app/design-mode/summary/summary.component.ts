import { Component, Input } from '@angular/core';
import { DesignFormService } from '../design-form.service';

@Component({
  selector: 'design-summary',
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.css',
  standalone: true,
})
export class SummaryComponent {

  constructor(private designFormService: DesignFormService) { }

  @Input() product_name: string = "Product Name";
  @Input() product_sku: string = "CPD100000";
  @Input() function_type_name: string = "CRISPRa";
  @Input() structure_type_name: string = "Standard";
  @Input() promoter_name: string = "PCMV";
  @Input() protein_tag_name: string = "None";
  @Input() fluorescene_marker_name: string = "None";
  @Input() selection_marker_name: string = "Puro";
  @Input() bacterial_marker_name: string = "CAM";
  @Input() target_sequence: string = "XXXXXX";

  product: any;
  deliveryFormatColumns: string[] = ['delivery_format_name', 'product_format_description', 'product_name', 'quantity', 'price'];
  deliveryFormatTable: any[] = [];

  ngOnChanges() {
    this.getDeliveryFormatTable()
  }

  ngOnInit() {
    this.getDeliveryFormatTable()
  }

  getDeliveryFormatTable() {
    if (this.target_sequence != null) {
      this.designFormService.getDeliveryFormatTable(
        this.structure_type_name,
        this.function_type_name,
        this.promoter_name,
        this.protein_tag_name,
        this.fluorescene_marker_name,
        this.selection_marker_name,
        this.bacterial_marker_name,
        this.target_sequence
      ).subscribe(
        (response) => {
          if (response.length == 0) {
            this.deliveryFormatTable = [];
          }
          else {
            this.deliveryFormatTable = response;
          } 
        }
      )
    }
  }

}
