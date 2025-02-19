import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { getDirtyValues } from '../../../../shared/utils/get-dity-values';
import { getErrorMessage } from '../../../../shared/utils/get-error-message';
import { Customer } from '../../../customer/models/customer.model';
import { Product } from '../../../product/models/product.model';
import { Order } from '../../models/order.model';
import { OrderService } from '../../services/order.service';
import { OrderCommonFormComponent } from '../order-common-form/order-common-form.component';

@Component({
  selector: 'app-order-create',
  imports: [OrderCommonFormComponent],
  templateUrl: './order-create.component.html',
  styleUrl: './order-create.component.css',
})
export class OrderCreateComponent {
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
  ) {}

  onSubmit(e: any) {
    const values = getDirtyValues<Order>(this.formGroup);
    this.orderService.createOrder(values).subscribe({
      next: (response) => {
        this.router.navigate(['order']);
      },
    });
  }
}
