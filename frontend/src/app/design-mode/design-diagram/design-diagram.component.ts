import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { ProductService } from '../../services/product.service';

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
  @Input() targetSequence: string = 'XXXXXX';
  @Input() geneSymbol: string = '';

  longName: string = '';
  product_sku: string = '0';

  constructor(private productService: ProductService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['functionTypeName'] || changes['structureTypeName'] || changes['promoterName'] || changes['proteinTagName'] ||
      changes['fluoresceneMarkerName'] || changes['selectionMarkerName'] || changes['bacterialMarkerName'] || changes['targetSequence']) {
      this.getLongName();
    }
  }

  getLongName() {
    this.longName = '';
    if (this.functionTypeName !== '') {
      this.longName += this.functionTypeName + ' ';
    }
    if (this.structureTypeName !== '' && this.structureTypeName !== null) {
      this.longName += this.structureTypeName + ' Kit';
    }
    if (this.geneSymbol !== '') {
      this.longName += '--Gene ' + this.targetSequence;
    }
    if (this.promoterName !== '') {
      this.productService.getProductSku(this.functionTypeName, this.structureTypeName, this.promoterName,
        this.proteinTagName, this.fluoresceneMarkerName, this.selectionMarkerName, this.bacterialMarkerName, this.targetSequence
      ).subscribe(res => {
        this.product_sku = res.product_sku;
        this.longName += "; " + this.product_sku;
      })
    }
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
