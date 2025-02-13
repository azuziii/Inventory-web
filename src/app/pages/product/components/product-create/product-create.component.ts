import { Component, OnInit } from '@angular/core';
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
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-create',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
  ],
  templateUrl: './product-create.component.html',
  styleUrl: './product-create.component.css',
})
export class ProductCreateComponent implements OnInit {
  constructor(
    private router: Router,
    protected readonly productService: ProductService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    console.log(this.router.events);
  }

  errors: { [s: string]: Partial<Record<keyof typeof Validators, string>> } = {
    name: {
      required: 'Name required',
    },
    price: {
      min: 'min 0',
    },
  };

  formGroup: FormGroup = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    price: new FormControl(0, [Validators.min(0)]),
  });

  onSubmit() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.invalid) return;
    const values = getDirtyValues<Product>(this.formGroup);

    this.productService.createProduct(values).subscribe({
      next: (response) => {
        this.router.navigate(['product']);
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

  get priceError() {
    return getErrorMessage(this.formGroup, 'price', this.errors['price']);
  }
}
