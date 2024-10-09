import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LandingPageService {

  productsData = [
    {name: 'Overexpression Targeted Knock-In', description: 'The product offers a tool for integrating target genes or regulatory cassettes into designated safe harbor sites, such as AAVS1, CCR5.', link: '/products/overexpression'},
    {name: 'Gene Knock-In Tagging', description: 'The product offers versatile options for attaching selected tags to the 3\' and 5\' ends of target genes.', link: 'products/gene-knock-in'},
    {name: 'Gene Knock-out', description: 'The product provides a rapid and efficient approach to disrupt gene expression for both research and therapeutic applications.', link: 'products/gene-knock-out'},
    {name: 'Gene Deletion', description: 'The product offers a tool for efficiently deleting genomic fragments of various sizes, ranging from short to large deletions over 10 kb.', link: 'products/gene-deletion'},
    {name: 'CRISPR RNA Knock-down', description: 'The product  offers a more specific and potent alternative to traditional RNAi methods for knocking down RNA expression levels.', link: 'products/rna-knock-down'}
  ]

  functionsData = [
    {name: 'CRISPR'},
    {name: 'cDNA'},
    {name: 'RNAI'}
  ]

  constructor() { }

  get_products() {
    return this.productsData;
  }

  get_functions() {
    return this.functionsData;
  }

}
