import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { concatMap, of } from 'rxjs';
import { getDirtyValues } from '../../../../shared/utils/get-dity-values';
import { Order, OrderItem } from '../../models/order.model';
import { OrderService } from '../../services/order.service';
import { OrderCommonFormComponent } from '../order-common-form/order-common-form.component';

@Component({
  selector: 'app-order-edit',
  imports: [OrderCommonFormComponent],
  templateUrl: './order-edit.component.html',
  styleUrl: './order-edit.component.css',
})
export class OrderEditComponent implements OnInit {
  order!: Order;
  formGroup: FormGroup = new FormGroup({
    date: new FormControl(null, [Validators.required]),
    cdn: new FormControl(null, [Validators.required]),
    customer: new FormControl(null, [Validators.required]),
    orders: new FormArray([], [Validators.required, Validators.minLength(1)]),
    id: new FormControl(null),
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    protected readonly orderService: OrderService,
  ) {}

  ngOnInit(): void {
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

          response.orders.forEach((order) => this.addExistingOrder(order));

          if (response.errors && response.errors.length) {
            this.orderService.message = response.errors[0];
          }
        },
      });
  }

  onSubmit() {
    const values = getDirtyValues<Partial<Order>>(this.formGroup);
    if (Object.keys(values).length === 0) {
      this.router.navigate(['order']);
      return;
    }

    if (values.orders) {
      of(...values.orders)
        .pipe(
          concatMap((order) => {
            if (order?.id) {
              return this.orderService.editOrderItem(order);
            } else {
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

  get orders() {
    return this.formGroup.get('orders') as FormArray;
  }

  addExistingOrder(
    values?: Partial<Pick<OrderItem, 'id' | 'product' | 'quantity'>>,
  ) {
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
}
