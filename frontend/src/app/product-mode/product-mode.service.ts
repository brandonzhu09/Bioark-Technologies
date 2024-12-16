import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductModeService {

  constructor() { }

  overexpressionData = {
    title: 'Overexpression Targeted Knock-In',
    description: 'The product offers a tool for integrating target genes or regulatory cassettes into designated safe harbor sites, such as AAVS1, CCR5.'
  }

  getOverexpressionData() {
    return this.overexpressionData;
  }
}
