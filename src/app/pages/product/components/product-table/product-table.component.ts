import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { Column } from '../../../../shared/components/table/model/Column.model';
import { TableComponent } from '../../../../shared/components/table/table.component';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-table',
  imports: [TableComponent, AsyncPipe, CardComponent],
  templateUrl: './product-table.component.html',
  styleUrl: './product-table.component.css',
})
export class ProductTableComponent {
  constructor(
    protected readonly router: Router,
    protected readonly productService: ProductService,
  ) {}

  columns: Column[] = [
    {
      header: 'Name',
      field: 'name',
    },
    {
      header: 'Price',
      field: 'price',
    },
  ];
}
