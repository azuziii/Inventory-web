import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  concatMap,
  from,
  map,
  Observable,
  switchMap,
  tap,
} from 'rxjs';
import { ApiService } from '../../../shared/services/api.service';
import { Order, OrderItem } from '../models/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private readonly api: ApiService) {
    this.fetchOrders().subscribe();
  }

  private readonly ordersSubject$: BehaviorSubject<Order[]> =
    new BehaviorSubject<Order[]>([]);
  orders$: Observable<Order[]> = this.ordersSubject$.asObservable();

  message = '';

  createOrder(input: Order) {
    this.message = '';
    return this.api.post<Order>('orders', input).pipe(
      map((response) => response.data),
      // Talking about thsi tap
      tap((response) => {
        from(input.orders)
          .pipe(
            concatMap((item) =>
              this.createOrderItem({
                ...item,
                order: response.id,
              }),
            ),
          )
          .subscribe();
      }),
      switchMap((order) => {
        return this.getOrder(order.id);
      }),
      // Not this one
      tap((order) => {
        const orders = this.ordersSubject$.value;
        orders.unshift(order);
        this.ordersSubject$.next(orders);
      }),
      catchError(({ error }) => {
        this.message = error.message;
        throw new Error(error);
      }),
    );
  }

  editOrder(input: Partial<Order>) {
    this.message = '';
    return this.api.patch<Order>('orders', input).pipe(
      map((response) => response.data),
      tap((order) => {
        this.ordersSubject$.next(
          this.ordersSubject$.value.map((p) => (p.id == order.id ? order : p)),
        );
      }),
      catchError(({ error }) => {
        this.message = error.message;
        throw new Error(error);
      }),
    );
  }

  fetchOrders(): Observable<Order[]> {
    return this.api.get<Order[]>('orders').pipe(
      map((response) => response.data),
      tap((orders) => {
        this.ordersSubject$.next(orders);
      }),
    );
  }

  getOrder(id: string): Observable<Order> {
    return this.api
      .get<Order>(`orders/${id}`)
      .pipe(map((response) => response.data));
  }

  createOrderItem(input: OrderItem) {
    this.message = '';
    console.log(2);
    console.log(input);
    console.log(2);
    return this.api.post<Order>('order/item', input).pipe(
      map((response) => response.data),
      catchError(({ error }) => {
        this.message = error.message;
        console.log(error);
        throw new Error(error);
      }),
    );
  }

  editOrderItem(input: Partial<OrderItem> & { id: string }) {
    this.message = '';
    console.log(1);
    console.log(input);
    console.log(1);
    return this.api.patch<Order>('order/item', input).pipe(
      map((response) => response.data),
      catchError(({ error }) => {
        this.message = error.message;
        throw new Error(error);
      }),
    );
  }
}
