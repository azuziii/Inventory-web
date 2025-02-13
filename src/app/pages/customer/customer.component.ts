import { Component } from '@angular/core';
import { CustomerTableComponent } from './component/customer-table/customer-table.component';

@Component({
  selector: 'app-customer',
  imports: [CustomerTableComponent],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.css',
})
export class CustomerComponent {}
