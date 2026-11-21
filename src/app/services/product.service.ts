import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';
import { API_BASE_URL } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = `${API_BASE_URL}/products`;

  getProducts(filter?: {
    categorySlug?: string;
    search?: string;
    sort?: string;
    limit?: number;
  }): Observable<Product[]> {
    let params = new HttpParams();

    if (filter) {
      if (filter.categorySlug && filter.categorySlug !== 'tat-ca') {
        params = params.set('categorySlug', filter.categorySlug);
      }
      if (filter.search && filter.search.trim() !== '') {
        params = params.set('search', filter.search.trim());
      }
      if (filter.sort) {
        params = params.set('sort', filter.sort);
      }
      if (filter.limit) {
        params = params.set('limit', filter.limit.toString());
      }
    }

    return this.http.get<Product[]>(this.apiUrl, { params });
  }

  getProductBySlug(slug: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${slug}`);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/id/${id}`);
  }
}
