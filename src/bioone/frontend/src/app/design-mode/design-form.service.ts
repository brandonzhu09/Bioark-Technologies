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

  getCodeP(functionTypeId: string, deliveryTypeSymbol: string) {
    return this.http.get<any>(`http://localhost:8000/products/get-code-p-by-function-delivery/`, {params: {function_type_id: functionTypeId, delivery_type_symbol: deliveryTypeSymbol}});
  }

  getGeneTableBySymbol(symbol: string) {
    return this.http.get<any[]>(`http://localhost:8000/products/get-gene-table-by-symbol/`, {params: {symbol: symbol}});
  }

}
