import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  getProductDetails(product_sku: string) {
    return this.http.get<any>(`${environment.apiBaseUrl}/api/products/get-product-summary/${product_sku}/`, { withCredentials: true })
  }

  getProductSku(
    functionTypeName: string,
    structureTypeName: string,
    promoterName: string,
    proteinTagName: string,
    fluoresceneMarkerName: string,
    selectionMarkerName: string,
    bacterialMarkerName: string,
    targetSequence: string) {
    return this.http.get<any>(
      `${environment.apiBaseUrl}/api/products/get-product-sku/`,
      {
        params: {
          structure_type_name: structureTypeName,
          function_type_name: functionTypeName,
          promoter_name: promoterName,
          protein_tag_name: proteinTagName,
          fluorescene_marker_name: fluoresceneMarkerName,
          selection_marker_name: selectionMarkerName,
          bacterial_marker_name: bacterialMarkerName,
          target_sequence: targetSequence,
        },
      }
    );
  }

  loadFeaturedProductPage(catalog_number: string) {
    return this.http.get<any>(`${environment.apiBaseUrl}/api/products/load-featured-product-page/${catalog_number}`, { withCredentials: true })
  }

  getLatestFeaturedProducts() {
    return this.http.get<any>(`${environment.apiBaseUrl}/api/products/get-latest-featured-products/`, { withCredentials: true })
  }
}
