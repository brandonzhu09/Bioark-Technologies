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
  @Input() promoterName: string = 'None';
  @Input() proteinTagName: string = 'None';
  @Input() fluoresceneMarkerName: string = 'None';
  @Input() selectionMarkerName: string = 'None';
  @Input() bacterialMarkerName: string = 'None';
  @Input() targetSequence: string = '';




}
