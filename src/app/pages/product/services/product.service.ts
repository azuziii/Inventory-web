import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, tap } from 'rxjs';
import { ApiService } from '../../../shared/services/api.service';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private readonly api: ApiService) {
    this.fetchProducts().subscribe();
  }

  private readonly productsSubject$: BehaviorSubject<Product[]> =
    new BehaviorSubject<Product[]>([]);
  products$: Observable<Product[]> = this.productsSubject$.asObservable();

  message = '';

  createProduct(input: Product) {
    this.message = '';
    return this.api.post<Product>('products', input).pipe(
      map((response) => response.data),
      tap((product) => {
        this.productsSubject$.next([product, ...this.productsSubject$.value]);
      }),
      catchError(({ error }) => {
        this.message = error.message;
        throw new Error(error);
      }),
    );
  }

  editProduct(input: Partial<Product>) {
    this.message = '';
    return this.api.patch<Product>('products', input).pipe(
      map((response) => response.data),
      tap((product) => {
        this.productsSubject$.next(
          this.productsSubject$.value.map((p) =>
            p.id == product.id ? product : p,
          ),
        );
      }),
      catchError(({ error }) => {
        this.message = error.message;
        throw new Error(error);
      }),
    );
  }

  fetchProducts(): Observable<Product[]> {
    return this.api.get<Product[]>('products').pipe(
      map((response) => response.data),
      tap((products) => {
        this.productsSubject$.next(products);
      }),
    );
  }

  getProduct(id: string): Observable<Product> {
    return this.api
      .get<Product>(`products/${id}`)
      .pipe(map((response) => response.data));
  }
}
