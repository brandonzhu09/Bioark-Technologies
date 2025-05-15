import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { environment } from '../../environment/environment';

@Injectable({
    providedIn: 'root',
})
export class DesignFormService {
    constructor(private http: HttpClient) { }

    getProductCategories() {
        return this.http.get(
            `${environment.apiBaseUrl}/api/products/load-product-categories/`, { withCredentials: true }
        );
    }

    getFunctionTypesByCategory(categoryName: string) {
        return this.http.get(
            `${environment.apiBaseUrl}/api/products/get-function-types-by-category/`,
            { params: { category_name: categoryName } }
        );
    }

    getStructureTypesByFunctionType(functionTypeName: string) {
        return this.http.get(
            `${environment.apiBaseUrl}/api/products/get-structure-types-by-function-type/`,
            { params: { function_type_name: functionTypeName } }
        );
    }

    getCodeP(functionTypeName: string, structureTypeName: string) {
        return this.http.get<any>(
            `${environment.apiBaseUrl}/api/products/get-code-p-parameters/`,
            {
                params: {
                    function_type_name: functionTypeName,
                    structure_type_name: structureTypeName,
                },
            }
        );
    }

    getGeneTableBySymbol(symbol: string, species: string, page_number: number = 1, page_size: number = 10) {
        const params = {
            "symbol": symbol,
            "species": species,
            "page_number": page_number,
            "page_size": page_size,
        }

        return this.http.get<any>(
            `${environment.apiBaseUrl}/api/products/get-gene-table-by-symbol/`,
            { params: params }
        );
    }

    getDeliveryFormatTable(
        structureTypeName: string,
        functionTypeName: string,
        promoterName: string,
        proteinTagName: string,
        fluoresceneMarkerName: string,
        selectionMarkerName: string,
        bacterialMarkerName: string,
        targetSequence: string
    ) {
        return this.http.get<any>(
            `${environment.apiBaseUrl}/api/products/get-delivery-format-table/`,
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
}
