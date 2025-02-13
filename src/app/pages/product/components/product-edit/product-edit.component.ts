import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputNumber } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { getDirtyValues } from '../../../../shared/utils/get-dity-values';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-edit',
  imports: [ReactiveFormsModule, InputTextModule, ButtonModule, InputNumber],
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.css',
})
export class ProductEditComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    protected readonly productService: ProductService,
  ) {}

  formGroup: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    price: new FormControl(0, [Validators.min(0)]),
  });

  product!: Product;

  ngOnInit(): void {
    this.productService
      .getProduct(this.route.snapshot.paramMap.get('id')!)
      .subscribe({
        next: (response) => {
          this.product = response;
          this.formGroup.patchValue(response);

          if (response.errors && response.errors.length) {
            this.productService.message = response.errors[0];
          }
        },
      });
  }

  onSubmit() {
    if (this.formGroup.invalid) return;

    const values = getDirtyValues<Partial<Product>>(this.formGroup);

    if (Object.keys(values).length === 0) {
      this.router.navigate(['product']);
      return;
    }

    this.productService
      .editProduct({
        ...values,
        id: this.product.id,
      })
      .subscribe({
        next: () => {
          this.router.navigate(['product']);
        },
      });
  }
}
