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
import { Shipment, ShipmentItem } from '../models/shipment.model';

@Injectable({
  providedIn: 'root',
})
export class ShipmentService {
  constructor(private readonly api: ApiService) {
    this.fetchShipments().subscribe();
  }

  private readonly shipmentsSubject$: BehaviorSubject<Shipment[]> =
    new BehaviorSubject<Shipment[]>([]);
  shipments$: Observable<Shipment[]> = this.shipmentsSubject$.asObservable();

  message = '';

  destinations = [
    { value: 'ALLER', header: 'Aller' },
    { value: 'RETOUR', header: 'Retour' },
  ];
  types = [
    { value: 'CAMION', header: 'CAMION' },
    { value: 'HONDA', header: 'HONDA' },
    { value: 'OTHER', header: 'AUTRE' },
  ];

  shipmentsColumns: Column[] = [
    {
      header: 'product',
      field: 'product',
    },
    {
      header: 'quantity',
      field: 'quantity',
    },
    {
      header: 'Customer',
      field: 'customer',
      subfield: 'name',
    },
  ];

  errors: { [s: string]: Partial<Record<keyof typeof Validators, string>> } = {
    date: {
      required: 'date required',
    },
    cdn: {
      required: 'cdn required',
    },
    bon: {
      required: 'bon required',
    },
    travels: {
      required: 'travels required',
    },
    destination: {
      required: 'destination required',
    },
    type: {
      required: 'type required',
    },
    customer: {
      required: 'customer required',
    },
    shipments: {
      required: 'shipments required',
      minLength: 'shipments min 1',
    },
    product: {
      required: 'product required',
    },
    quantity: {
      required: 'quantity required',
      min: 'quantity min 0',
    },
  };

  createShipment(input: Shipment) {
    this.message = '';
    return this.api.post<Shipment>('shipments', input).pipe(
      map((response) => response.data),
      // Talking about thsi tap
      tap((response) => {
        from(input.shipments)
          .pipe(
            concatMap((item) =>
              this.createShipmentItem({
                ...item,
                shipment: response.id,
              }),
            ),
          )
          .subscribe();
      }),
      switchMap((shipment) => {
        return this.getShipment(shipment.id);
      }),
      // Not this one
      tap((shipment) => {
        const shipments = this.shipmentsSubject$.value;
        shipments.unshift(shipment);
        this.shipmentsSubject$.next(shipments);
      }),
      catchError(({ error }) => {
        this.message = error.message;
        throw new Error(error);
      }),
    );
  }

  editShipment(input: Partial<Shipment>) {
    this.message = '';
    return this.api.patch<Shipment>('shipments', input).pipe(
      map((response) => response.data),
      tap((shipment) => {
        this.shipmentsSubject$.next(
          this.shipmentsSubject$.value.map((p) =>
            p.id == shipment.id ? shipment : p,
          ),
        );
      }),
      catchError(({ error }) => {
        this.message = error.message;
        throw new Error(error);
      }),
    );
  }

  fetchShipments(): Observable<Shipment[]> {
    return this.api.get<Shipment[]>('shipments').pipe(
      map((response) => response.data),
      tap((shipments) => {
        this.shipmentsSubject$.next(shipments);
      }),
    );
  }

  getShipment(id: string): Observable<Shipment> {
    return this.api
      .get<Shipment>(`shipments/${id}`)
      .pipe(map((response) => response.data));
  }

  createShipmentItem(input: ShipmentItem) {
    this.message = '';
    return this.api.post<Shipment>('shipment/item', input).pipe(
      map((response) => response.data),
      catchError(({ error }) => {
        this.message = error.message;
        throw new Error(error);
      }),
    );
  }

  editShipmentItem(input: Partial<ShipmentItem> & { id: string }) {
    this.message = '';
    return this.api.patch<Shipment>('shipment/item', input).pipe(
      map((response) => response.data),
      catchError(({ error }) => {
        this.message = error.message;
        throw new Error(error);
      }),
    );
  }
}
