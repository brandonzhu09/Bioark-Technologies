import { Component, Input } from '@angular/core';

@Component({
  selector: 'design-summary',
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.css',
  standalone: true,
})
export class SummaryComponent {

  @Input() productCategory: any = "";
  @Input() functionType: any = "";
  @Input() deliveryType: any = "";
  @Input() promoterName: any = "";
  @Input() proteinTagName: any = "";
  @Input() fluoresceneMarkerName: any = "";
  @Input() selectionMarkerName: any = "";
  @Input() bacterialMarkerName: any = "";
  @Input() targetSequence: any = "";
  @Input() deliveryFormats: any = "";

}
