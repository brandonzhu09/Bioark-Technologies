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

  @Input() productId: number = 23;

  product: any;

  ngOnChanges() {
    this.getProductSummary()
  }

  ngOnInit() {
    this.getProductSummary()
  }

  getProductSummary() {
    if (this.productId != -1) {
      this.designFormService.getProductSummary(this.productId).subscribe(
        (response) => {this.product = response; console.log(this.product)}
      )
    }
  }

}
