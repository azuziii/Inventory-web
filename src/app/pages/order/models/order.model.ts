import { Customer } from '../../customer/models/customer.model';
import { Product } from '../../product/models/product.model';

export interface Order {
  id: string;
  date: string;
  cdn: number;
  customer: Customer;
  orders: OrderItem[];
  errors?: string[];
}

export interface OrderItem {
  id: string;
  quantity: number;
  product: Product;
  order?: string;
}
