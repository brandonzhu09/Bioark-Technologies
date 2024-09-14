import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LandingPageService {

  productsData = [
    {name: 'Vectors'},
    {name: 'In Vitro RNA'},
    {name: 'Virus'},
    {name: 'Cell Line'}
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
