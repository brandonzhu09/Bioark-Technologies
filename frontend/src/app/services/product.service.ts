import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  getProductDetails(product_sku: string) {
    return this.http.get<any>(`${environment.apiBaseUrl}/products/decode-product-sku`)
  }
}
