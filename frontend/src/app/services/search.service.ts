import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private http: HttpClient) { }

  search(query: string, page_size: string = '10', page_number: string = '1') {
    return this.http.get<any>(`${environment.apiBaseUrl}/api/search/?q=${query}&page_size=${page_size}&page_number=${page_number}`, { withCredentials: true })
  }
}
