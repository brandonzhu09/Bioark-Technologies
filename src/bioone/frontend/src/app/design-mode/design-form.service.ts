import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DesignFormService {
  constructor(private http: HttpClient) { }

  getProductCategories() {
    return this.http.get(`http://localhost:8000/products/load-product-categories/`);
  }

  getFunctionTypesByCategory(categoryId: string) {
    return this.http.get(`http://localhost:8000/products/get-function-types-by-category/`, {params: {category_id: categoryId}});
  }

  getDeliveryTypesByFunctionType(functionTypeId: string) {
    return this.http.get(`http://localhost:8000/products/get-delivery-types-by-function-type/`, {params: {function_type_id: functionTypeId}});
  }
}
