import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'design-diagram',
  templateUrl: './design-diagram.component.html',
  styleUrl: './design-diagram.component.css',
  standalone: true,
  imports: [CommonModule]
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

  longName: string = '';


  getLongName() {
    this.longName = '';
    if (this.functionTypeName !== '') {
      this.longName += this.functionTypeName + ' ';
    }
    if (this.structureTypeName !== '' && this.structureTypeName !== null) {
      this.longName += this.structureTypeName + ' Kit';
    }
    if (this.targetSequence !== '' && this.targetSequence !== 'XXXXXX' && this.targetSequence !== '000000') {
      this.longName += '--Gene ' + this.targetSequence;
    }
    return this.longName;
  }

  getShortName() {
    let shortName = '';
    if (this.functionTypeName !== '') {
      shortName += this.functionTypeName + ' ';
    }
    if (this.structureTypeName !== '' && this.structureTypeName !== null) {
      shortName += this.structureTypeName + ' Kit';
    }
    return shortName;
  }


}
