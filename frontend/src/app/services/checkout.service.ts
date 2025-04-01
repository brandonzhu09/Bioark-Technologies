import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  constructor(private authService: AuthService, private http: HttpClient) { }

  payWithPurchaseOrder(data: any) {
    const headers = new HttpHeaders({
      'X-CSRFToken': this.authService.getCookie('csrftoken') || ''
    });

    const formData = new FormData();
    formData.append('order_number', data.order_number);
    formData.append('po_file', data.po_file, data.po_file.name);
    formData.append('cart', JSON.stringify(data.cart));
    formData.append('quantity', data.quantity);
    formData.append('subtotal', data.subtotal);
    formData.append('shipping_amount', data.shipping_amount);
    formData.append('tax_amount', data.tax_amount);
    formData.append('total_price', data.total_price);
    formData.append('address', JSON.stringify(data.address));
    formData.append('credit_price', data.credit_price);
    formData.append('po_price', data.po_price);

    return this.http.post<any>(`${environment.apiBaseUrl}/api/orders/pay-with-purchase-order/`, formData, {
      headers: headers,
      withCredentials: true
    });
  }

  calculateShippingFee(subtotal: number) {
    if (subtotal >= 500) {
      return 0;
    }
    return 43;
  }
}
