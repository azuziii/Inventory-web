import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AutoComplete, AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { getDirtyValues } from '../../../../shared/utils/get-dity-values';
import { getErrorMessage } from '../../../../shared/utils/get-error-message';
import autoCompleteFilter from '../../../../shared/utils/input-filter';
import { Customer } from '../../../customer/models/customer.model';
import { CustomerService } from '../../../customer/services/customer.service';
import { Product } from '../../../product/models/product.model';
import { ProductService } from '../../../product/services/product.service';
import { Order } from '../../models/order.model';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-order-create',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    AutoComplete,
    TableModule,
    CardComponent,
  ],
  templateUrl: './order-create.component.html',
  styleUrl: './order-create.component.css',
})
export class OrderCreateComponent implements OnInit {
  errors;
  getErrorMessage = getErrorMessage;
  customers!: Customer[];
  products!: Product[];
  filteredCustomers!: Customer[];
  filteredProducts!: Product[];
  formGroup: FormGroup = new FormGroup({
    date: new FormControl(new Date().toISOString().split('T')[0], [
      Validators.required,
    ]),
    cdn: new FormControl(null, [Validators.required]),
    customer: new FormControl(null, [Validators.required]),
    orders: new FormArray([], [Validators.required, Validators.minLength(1)]),
  });

  constructor(
    private router: Router,
    protected readonly orderService: OrderService,
    protected readonly customerService: CustomerService,
    protected readonly productService: ProductService,
  ) {
    this.errors = this.orderService.errors;
  }

  ngOnInit(): void {
    this.customerService.fetchCustomers().subscribe({
      next: (response: Customer[]) => {
        this.customers = response;
      },
    });

    this.productService.fetchProducts().subscribe({
      next: (response: Product[]) => {
        this.products = response;
      },
    });

    this.formGroup.get('date')!.markAsDirty();
  }

  onSubmit() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.invalid) return;
    const values = getDirtyValues<Order>(this.formGroup);
    this.orderService.createOrder(values).subscribe({
      next: (response) => {
        this.router.navigate(['order']);
      },
    });
  }

  get orders() {
    return this.formGroup.get('orders') as FormArray;
  }

  get dateError() {
    return getErrorMessage(this.formGroup, 'date', this.errors['date']);
  }

  get cdnError() {
    return getErrorMessage(this.formGroup, 'cdn', this.errors['cdn']);
  }
  get customerError() {
    return getErrorMessage(this.formGroup, 'customer', this.errors['customer']);
  }
  get ordersError() {
    return getErrorMessage(this.formGroup, 'orders', this.errors['orders']);
  }

  get productError() {
    return getErrorMessage(this.orders, 'product', this.errors['product']);
  }

  get quantityError() {
    return getErrorMessage(this.orders, 'quantity', this.errors['quantity']);
  }

  filterCustomers(event: AutoCompleteCompleteEvent) {
    this.filteredCustomers = autoCompleteFilter(event, this.customers);
  }

  filterProducts(event: AutoCompleteCompleteEvent) {
    this.filteredProducts = autoCompleteFilter(event, this.products);
  }
  onAddOrder() {
    const order = new FormGroup({
      product: new FormControl(null, [Validators.required]),
      quantity: new FormControl(0, [Validators.required, Validators.min(0)]),
    });
    this.orders.push(order);
  }

  onRemoveRow(index: number) {
    this.orders.removeAt(index);
  }
}
