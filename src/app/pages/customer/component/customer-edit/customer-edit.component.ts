import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { getDirtyValues } from '../../../../shared/utils/get-dity-values';
import { Customer } from '../../models/customer.model';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-customer-edit',
  imports: [ReactiveFormsModule, InputTextModule, ButtonModule],
  templateUrl: './customer-edit.component.html',
  styleUrl: './customer-edit.component.css',
})
export class CustomerEditComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    protected readonly customerService: CustomerService,
  ) {}

  formGroup: FormGroup = new FormGroup({
    name: new FormControl(''),
    ice: new FormControl(''),
    address: new FormControl(''),
    city: new FormControl(''),
  });

  customer!: Customer;

  ngOnInit(): void {
    this.customerService
      .getCustomer(this.route.snapshot.paramMap.get('id')!)
      .subscribe({
        next: (response) => {
          this.customer = response;
          this.formGroup.patchValue(response);

          if (response.errors && response.errors.length) {
            this.customerService.message = response.errors[0];
          }
        },
      });
  }

  onSubmit() {
    if (this.formGroup.invalid) return;

    const values = getDirtyValues<Partial<Customer>>(this.formGroup);

    if (Object.keys(values).length === 0) {
      this.router.navigate(['customer']);
      return;
    }

    this.customerService
      .editCustomer({
        ...values,
        id: this.customer.id,
      })
      .subscribe({
        next: () => {
          this.router.navigate(['customer']);
        },
      });
  }
}
