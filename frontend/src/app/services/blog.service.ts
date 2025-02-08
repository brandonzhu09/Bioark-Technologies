import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  constructor(private http: HttpClient) { }

  getBlog(blogId: string) {
    return this.http.get<any>(`${environment.apiBaseUrl}/api/blogs/get-blog/${blogId}/`, { withCredentials: true });
  }

}
