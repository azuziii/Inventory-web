import { Customer } from '../../customer/models/customer.model';
import { Product } from '../../product/models/product.model';

export interface Shipment {
  id: string;
  date: Date;
  bon: number;
  travels: number;
  type: string;
  destination: string;
  customer: Customer;
  shipments: ShipmentItem[];
  errors: any[];
}

export interface ShipmentItem {
  id: string;
  product: Product;
  quantity: number;
  cdn: string;
  shipment?: string;
}
