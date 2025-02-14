import { Component } from '@angular/core';
import { OrderTableComponent } from './components/order-table/order-table.component';

@Component({
  selector: 'app-order',
  imports: [OrderTableComponent],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css',
})
export class OrderComponent {}
