import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DesignFormService {
  constructor(private http: HttpClient) { }

  getProductCategories() {
    return this.http.get(`http://localhost:8000/products/product-categories/`);
  }

  getFunctionTypesByCategory(categoryId: string) {
    return this.http.get(`http://localhost:8000/products/function-types-by-category/`, {params: {category_id: categoryId}});
  }
}
