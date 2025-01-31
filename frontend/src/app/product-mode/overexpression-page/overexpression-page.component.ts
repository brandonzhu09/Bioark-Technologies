import { Component, ElementRef, QueryList, ViewChild } from '@angular/core';

@Component({
  selector: 'app-overexpression-page',
  templateUrl: './overexpression-page.component.html',
  styleUrl: './overexpression-page.component.css'
})
export class OverexpressionPageComponent {
  floatingCards = [
    { 'id': 1, 'title': 'Featured Product: CPD100011d', 'name': 'pCas-Guide', 'type': 'Plasmid/DNA', 'price': 'Price: $212' },
    { 'id': 2, 'title': 'Featured Product: CPD100011e', 'name': 'pCas-Guide', 'type': 'Plasmid/DNA', 'price': 'Price: $212' },
  ]
  private offsets: number[] = [];

  @ViewChild('floatingBox', { static: false }) productContainer!: ElementRef;

  calculateOffsets() {
    const container = this.productContainer.nativeElement;
    const productCards = container.querySelectorAll('.product-card');
    let cumulativeTop = 180;

    productCards.forEach((card: HTMLElement) => {
      card.style.top = `${cumulativeTop}px`;
      cumulativeTop += card.offsetHeight + 10;
    });
  }

  ngAfterViewInit(): void {
    this.calculateOffsets()
  }

  ngAfterViewChecked(): void {
    // Optionally trigger recalculation if cards or heights change
    this.calculateOffsets();
  }

  getTopOffset(index: number): number {
    return this.offsets[index] ?? 0; // Return the precomputed offset
  }

}


