import { Component, Input } from '@angular/core';

@Component({
  selector: 'design-diagram',
  templateUrl: './design-diagram.component.html',
  styleUrl: './design-diagram.component.css',
  standalone: true
})
export class DesignDiagramComponent {
  @Input() category: string = '';
  @Input() functionTypeName: string = '';
  @Input() structureTypeName: string = '';
  @Input() promoterName: string = '';
  @Input() proteinTagName: string = '';
  @Input() fluoresceneMarkerName: string = '';
  @Input() selectionMarkerName: string = '';
  @Input() bacterialMarkerName: string = '';
  @Input() targetSequence: string = '';




}
