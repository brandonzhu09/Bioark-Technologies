import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

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

  getDeliveryFormatTable(
    deliveryTypeName: string,
    functionTypeName: string,
    promoterName: string,
    proteinTagName: string,
    fluoresceneMarkerName: string,
    selectionMarkerName: string,
    bacterialMarkerName: string,
    targetSequence: string) {
    return this.http.get<any[]>(`http://localhost:8000/products/get-delivery-format-table/`, 
      {params: {
        delivery_type_name: deliveryTypeName,
        function_type_name: functionTypeName,
        promoter_name: promoterName,
        protein_tag_name: proteinTagName,
        fluorescene_marker_name: fluoresceneMarkerName,
        selection_marker_name: selectionMarkerName,
        bacterial_marker_name: bacterialMarkerName,
        target_sequence: targetSequence,
    }});
  }

  getProductSummary(productId: number) {
    return this.http.get(`http://localhost:8000/products/get-product-summary/`, {params: {product_id: productId}});
  }

}
