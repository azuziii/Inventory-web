import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, output } from '@angular/core';
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
import { getErrorMessage } from '../../../../shared/utils/get-error-message';
import autoCompleteFilter from '../../../../shared/utils/input-filter';
import { Customer } from '../../../customer/models/customer.model';
import { CustomerService } from '../../../customer/services/customer.service';
import { Product } from '../../../product/models/product.model';
import { ProductService } from '../../../product/services/product.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-order-common-form',
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
  templateUrl: './order-common-form.component.html',
  styleUrl: './order-common-form.component.css',
})
export class OrderCommonFormComponent implements OnInit {
  @Input() values: any = null;
  @Input({ required: true }) formGroup!: FormGroup;
  submitEvent = output();

  errors;
  getErrorMessage = getErrorMessage;
  customers!: Customer[];
  products!: Product[];
  filteredCustomers!: Customer[];
  filteredProducts!: Product[];

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

  onSubmit(e: any) {
    console.log(e);
    this.formGroup.markAllAsTouched();
    if (this.formGroup.invalid) return;
    this.submitEvent.emit();
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
