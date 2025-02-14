import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AutoComplete, AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { concatMap, of } from 'rxjs';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { Column } from '../../../../shared/components/table/model/Column.model';
import { getDirtyValues } from '../../../../shared/utils/get-dity-values';
import { getErrorMessage } from '../../../../shared/utils/get-error-message';
import autoCompleteFilter from '../../../../shared/utils/input-filter';
import { Customer } from '../../../customer/models/customer.model';
import { CustomerService } from '../../../customer/services/customer.service';
import { Product } from '../../../product/models/product.model';
import { ProductService } from '../../../product/services/product.service';
import { Order, OrderItem } from '../../models/order.model';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-order-edit',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    AutoComplete,
    TableModule,
    CardComponent,
  ],
  templateUrl: './order-edit.component.html',
  styleUrl: './order-edit.component.css',
})
export class OrderEditComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    protected readonly orderService: OrderService,
    protected readonly customerService: CustomerService,
    protected readonly productService: ProductService,
  ) {}

  getErrorMessage = getErrorMessage;

  order!: Order;
  customers!: Customer[];
  products!: Product[];
  filteredCustomers!: Customer[];
  filteredProducts!: Product[];

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

  formGroup: FormGroup = new FormGroup({
    date: new FormControl(null, [Validators.required]),
    cdn: new FormControl(null, [Validators.required]),
    customer: new FormControl(null, [Validators.required]),
    orders: new FormArray([], [Validators.required, Validators.minLength(1)]),
    id: new FormControl(null),
  });

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

    this.orderService
      .getOrder(this.route.snapshot.paramMap.get('id')!)
      .subscribe({
        next: (response) => {
          this.order = response;
          this.formGroup.patchValue({
            ...response,
            date: new Date(response.date).toISOString().split('T')[0],
            customer: response.customer.name,
          });

          response.orders.forEach((order) => this.onAddOrder(order));

          if (response.errors && response.errors.length) {
            this.orderService.message = response.errors[0];
          }
        },
      });
  }

  onSubmit() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.invalid) return;

    const values = getDirtyValues<Partial<Order>>(this.formGroup);
    console.log(values);
    if (Object.keys(values).length === 0) {
      this.router.navigate(['order']);
      return;
    }

    if (values.orders) {
      console.log(values.orders);
      of(...values.orders)
        .pipe(
          concatMap((order) => {
            console.log(order);
            if (order?.id) {
              console.log(99);
              return this.orderService.editOrderItem(order);
            } else {
              console.log(88);
              return this.orderService.createOrderItem({
                ...order,
                order: this.formGroup.get('id')!.value,
              });
            }
          }),
        )
        .subscribe();
    }

    this.orderService
      .editOrder({
        ...values,
        id: this.order.id,
      })
      .subscribe({
        next: () => {
          this.router.navigate(['order']);
        },
      });
  }

  filterCustomers(event: AutoCompleteCompleteEvent) {
    this.filteredCustomers = autoCompleteFilter(event, this.customers);
  }

  filterProducts(event: AutoCompleteCompleteEvent) {
    console.log(this.products);
    this.filteredProducts = autoCompleteFilter(event, this.products);
  }

  get orders() {
    return this.formGroup.get('orders') as FormArray;
  }

  onAddOrder(values?: Partial<Pick<OrderItem, 'id' | 'product' | 'quantity'>>) {
    const orderControls: { [key: string]: FormControl } = {
      product: new FormControl(values?.product || null, [Validators.required]),
      quantity: new FormControl(values?.quantity || 0, [
        Validators.required,
        Validators.min(0),
      ]),
    };

    if (values?.id) {
      orderControls['id'] = new FormControl(values.id);
      orderControls['id'].markAsDirty();
    }

    // TODO: mark orders as dirty when item added
    const order = new FormGroup(orderControls);
    this.orders.push(order);
  }

  onRemoveRow(index: number) {
    this.orders.removeAt(index);
  }
}
