import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from './models/api-response.interface';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private readonly http: HttpClient) {}

  API_URL = 'http://localhost:3001/api/v1/';

  get<T>(endpoint: string) {
    return this.http.get<ApiResponse<T>>(this.API_URL + endpoint, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  post<T>(endpoint: string, body: any) {
    return this.http.post<ApiResponse<T>>(this.API_URL + endpoint, body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  patch<T>(endpoint: string, body: any) {
    return this.http.patch<ApiResponse<T>>(this.API_URL + endpoint, body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  delete<T>(endpoint: string) {
    return this.http.delete<ApiResponse<T>>(this.API_URL + endpoint, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
