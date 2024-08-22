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

  @Input() productId: number = 1;

  product: any;

  ngOnInit() {
    this.designFormService.getProductSummary(this.productId).subscribe(
      (response) => {this.product = response;}
    )
  }

}
