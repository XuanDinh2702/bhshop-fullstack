import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HomeDataResponse } from '../models/home-response';
import { API_BASE_URL } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private http = inject(HttpClient);
  private apiUrl = `${API_BASE_URL}/home`;

  getHomeData(): Observable<HomeDataResponse> {
    return this.http.get<HomeDataResponse>(this.apiUrl);
  }
}
