import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { Column } from '../../../../shared/components/table/model/Column.model';
import { TableComponent } from '../../../../shared/components/table/table.component';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-order-table',
  imports: [TableComponent, AsyncPipe, CardComponent],
  templateUrl: './order-table.component.html',
  styleUrl: './order-table.component.css',
})
export class OrderTableComponent {
  constructor(
    protected readonly router: Router,
    protected readonly orderService: OrderService,
  ) {}

  columns: Column[] = [
    {
      header: 'date',
      field: 'date',
    },
    {
      header: 'cdn',
      field: 'cdn',
    },
    {
      header: 'customer',
      field: 'customer',
      subfield: 'name',
    },
  ];
}
