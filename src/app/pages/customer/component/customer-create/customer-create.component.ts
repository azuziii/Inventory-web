import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { getDirtyValues } from '../../../../shared/utils/get-dity-values';
import { getErrorMessage } from '../../../../shared/utils/get-error-message';
import { Customer } from '../../models/customer.model';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-customer-create',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
  ],
  templateUrl: './customer-create.component.html',
  styleUrl: './customer-create.component.css',
})
export class CustomerCreateComponent {
  constructor(
    private router: Router,
    protected readonly customerService: CustomerService,
    private activatedRoute: ActivatedRoute,
  ) {}

  errors: { [s: string]: Partial<Record<keyof typeof Validators, string>> } = {
    name: {
      required: 'Name required',
    },
    ice: {
      required: 'ICE required',
    },
  };

  formGroup: FormGroup = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    ice: new FormControl(null, [Validators.required]),
    address: new FormControl(null),
    city: new FormControl(null),
  });

  onSubmit() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.invalid) return;
    const values = getDirtyValues<Customer>(this.formGroup);

    this.customerService.createCustomer(values).subscribe({
      next: (response) => {
        this.router.navigate(['customer']);
      },
    });
  }

  get nameErrors() {
    const target = this.formGroup.get('name')!;
    if (target.invalid && target.touched) {
      return target.errors;
    }
    return null;
  }

  get nameError() {
    return getErrorMessage(this.formGroup, 'name', this.errors['name']);
  }

  get iceError() {
    return getErrorMessage(this.formGroup, 'ice', this.errors['ice']);
  }
}
