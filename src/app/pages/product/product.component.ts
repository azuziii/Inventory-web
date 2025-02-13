import { Component } from '@angular/core';
import { ProductTableComponent } from './components/product-table/product-table.component';

@Component({
  selector: 'app-product',
  imports: [ProductTableComponent],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent {}
