import { Routes } from '@angular/router';
import { CustomerCreateComponent } from './pages/customer/component/customer-create/customer-create.component';
import { CustomerEditComponent } from './pages/customer/component/customer-edit/customer-edit.component';
import { CustomerComponent } from './pages/customer/customer.component';
import { OrderCreateComponent } from './pages/order/components/order-create/order-create.component';
import { OrderEditComponent } from './pages/order/components/order-edit/order-edit.component';
import { OrderComponent } from './pages/order/order.component';
import { ProductCreateComponent } from './pages/product/components/product-create/product-create.component';
import { ProductEditComponent } from './pages/product/components/product-edit/product-edit.component';
import { ProductComponent } from './pages/product/product.component';
import { ShipmentCreateComponent } from './pages/shipment/components/shipment-create/shipment-create.component';
import { ShipmentEditComponent } from './pages/shipment/components/shipment-edit/shipment-edit.component';
import { ShipmentComponent } from './pages/shipment/shipment.component';

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
  {
    path: 'shipment',
    component: ShipmentComponent,
    data: {
      title: 'Shipments',
    },
  },
  {
    path: 'shipment-create',
    component: ShipmentCreateComponent,
    data: {
      title: 'Create Shipment',
    },
  },
  {
    path: 'shipment-edit/:id',
    component: ShipmentEditComponent,
    data: {
      title: 'Edit Shipment',
    },
  },
  {
    path: 'order',
    component: OrderComponent,
    data: {
      title: 'Orders',
    },
  },
  {
    path: 'order-create',
    component: OrderCreateComponent,
    data: {
      title: 'Create Order',
    },
  },
  {
    path: 'order-edit/:id',
    component: OrderEditComponent,
    data: {
      title: 'Edit Order',
    },
  },
];
