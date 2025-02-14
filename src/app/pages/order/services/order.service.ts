import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
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
import { Column } from '../../../shared/components/table/model/Column.model';
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

  ordersColumns: Column[] = [
    {
      header: 'product',
      field: 'product',
    },
    {
      header: 'quantity',
      field: 'quantity',
    },
  ];

  errors: { [s: string]: Partial<Record<keyof typeof Validators, string>> } = {
    date: {
      required: 'date required',
    },
    cdn: {
      required: 'cdn required',
    },
    customer: {
      required: 'customer required',
    },
    orders: {
      required: 'orders required',
      minLength: 'orders min 1',
    },
    product: {
      required: 'product required',
    },
    quantity: {
      required: 'quantity required',
      min: 'quantity min 0',
    },
  };

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
    return this.api.post<Order>('order/item', input).pipe(
      map((response) => response.data),
      catchError(({ error }) => {
        this.message = error.message;
        throw new Error(error);
      }),
    );
  }

  editOrderItem(input: Partial<OrderItem> & { id: string }) {
    this.message = '';
    return this.api.patch<Order>('order/item', input).pipe(
      map((response) => response.data),
      catchError(({ error }) => {
        this.message = error.message;
        throw new Error(error);
      }),
    );
  }
}
