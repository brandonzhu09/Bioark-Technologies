import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  productsData = [
    {name: 'Vectors'},
    {name: 'In Vitro RNA'},
    {name: 'Virus'},
    {name: 'Cell Line'}
  ]

  constructor() { }

  get_products() {
    return this.productsData;
  }

}
