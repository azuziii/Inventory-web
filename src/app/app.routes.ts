import { Routes } from '@angular/router';
import { CustomerCreateComponent } from './pages/customer/component/customer-create/customer-create.component';
import { CustomerEditComponent } from './pages/customer/component/customer-edit/customer-edit.component';
import { CustomerComponent } from './pages/customer/customer.component';
import { ProductCreateComponent } from './pages/product/components/product-create/product-create.component';
import { ProductEditComponent } from './pages/product/components/product-edit/product-edit.component';
import { ProductComponent } from './pages/product/product.component';

export const routes: Routes = [
  {
    path: 'product',
    component: ProductComponent,
    data: {
      title: 'Products',
    },
  },
  {
    path: 'product-create',
    component: ProductCreateComponent,
    data: {
      title: 'Create Product',
    },
  },
  {
    path: 'product-edit/:id',
    component: ProductEditComponent,
    data: {
      title: 'Edit Product',
    },
  },
  {
    path: 'customer',
    component: CustomerComponent,
    data: {
      title: 'Customers',
    },
  },
  {
    path: 'customer-create',
    component: CustomerCreateComponent,
    data: {
      title: 'Create Customer',
    },
  },
  {
    path: 'customer-edit/:id',
    component: CustomerEditComponent,
    data: {
      title: 'Edit Customer',
    },
  },
];
