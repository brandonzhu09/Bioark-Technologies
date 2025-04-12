import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { firstValueFrom } from 'rxjs';

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
  @Input() geneSymbol: string = '';
  @Input() sku: string = '';

  longName: string = '';
  product_sku: string = '';

  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.getLongName();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['functionTypeName'] || changes['structureTypeName'] || changes['promoterName'] || changes['proteinTagName'] ||
      changes['fluoresceneMarkerName'] || changes['selectionMarkerName'] || changes['bacterialMarkerName'] || changes['targetSequence']) {
      this.getLongName();
    }
  }

  async getLongName() {
    this.longName = '';
    if (this.functionTypeName !== '') {
      this.longName += this.functionTypeName + ' ';
    }
    if (this.structureTypeName !== '') {
      this.longName += this.structureTypeName + ' Kit';
    }
    if (this.geneSymbol !== '') {
      this.longName += '--Gene ' + this.targetSequence;
    }
    if (this.sku !== '') {
      this.longName += "; " + this.sku;
    }
    else if (this.promoterName !== '') {
      const res = await firstValueFrom(this.productService.getProductSku(this.functionTypeName, this.structureTypeName, this.promoterName,
        this.proteinTagName, this.fluoresceneMarkerName, this.selectionMarkerName, this.bacterialMarkerName, this.targetSequence
      ))

      this.longName += " (" + res.product_sku + ")";
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
