import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, tap } from 'rxjs';
import { ApiService } from '../../../shared/services/api.service';
import { Customer } from '../models/customer.model';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(private readonly api: ApiService) {
    this.fetchCustomers().subscribe();
  }

  private readonly customersSubject$: BehaviorSubject<Customer[]> =
    new BehaviorSubject<Customer[]>([]);
  customers$: Observable<Customer[]> = this.customersSubject$.asObservable();

  message = '';

  createCustomer(input: Customer) {
    this.message = '';
    return this.api.post<Customer>('customers', input).pipe(
      map((response) => response.data),
      tap((customer) => {
        this.customersSubject$.next([
          customer,
          ...this.customersSubject$.value,
        ]);
      }),
      catchError(({ error }) => {
        this.message = error.message;
        throw new Error(error);
      }),
    );
  }

  editCustomer(input: Partial<Customer>) {
    this.message = '';
    return this.api.patch<Customer>('customers', input).pipe(
      map((response) => response.data),
      tap((customer) => {
        this.customersSubject$.next(
          this.customersSubject$.value.map((p) =>
            p.id == customer.id ? customer : p,
          ),
        );
      }),
      catchError(({ error }) => {
        this.message = error.message;
        throw new Error(error);
      }),
    );
  }

  fetchCustomers(): Observable<Customer[]> {
    return this.api.get<Customer[]>('customers').pipe(
      map((response) => response.data),
      tap((customers) => {
        this.customersSubject$.next(customers);
      }),
    );
  }

  getCustomer(id: string): Observable<Customer> {
    return this.api
      .get<Customer>(`customers/${id}`)
      .pipe(map((response) => response.data));
  }
}
