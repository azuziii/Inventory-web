import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, output } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AutoComplete, AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { getErrorMessage } from '../../../../shared/utils/get-error-message';
import autoCompleteFilter from '../../../../shared/utils/input-filter';
import { Customer } from '../../../customer/models/customer.model';
import { CustomerService } from '../../../customer/services/customer.service';
import { Product } from '../../../product/models/product.model';
import { ProductService } from '../../../product/services/product.service';
import { ShipmentService } from '../../services/shipment.service';

@Component({
  selector: 'app-shipment-common-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    AutoComplete,
    TableModule,
    CardComponent,
    SelectModule,
  ],
  templateUrl: './shipment-common-form.component.html',
  styleUrl: './shipment-common-form.component.css',
})
export class ShipmentCommonFormComponent implements OnInit {
  @Input() values: any = null;
  @Input({ required: true }) formGroup!: FormGroup;
  submitEvent = output();

  errors;
  getErrorMessage = getErrorMessage;
  customers!: Customer[];
  products!: Product[];
  filteredCustomers!: Customer[];
  filteredProducts!: Product[];

  constructor(
    protected readonly shipmentService: ShipmentService,
    protected readonly customerService: CustomerService,
    protected readonly productService: ProductService,
  ) {
    this.errors = this.shipmentService.errors;
  }

  ngOnInit(): void {
    this.customerService.fetchCustomers().subscribe({
      next: (response: Customer[]) => {
        this.customers = response;
      },
    });

    this.productService.fetchProducts().subscribe({
      next: (response: Product[]) => {
        this.products = response;
      },
    });

    this.formGroup.get('date')!.markAsDirty();
  }

  get shipments() {
    return this.formGroup.get('shipments') as FormArray;
  }

  get dateError() {
    return getErrorMessage(this.formGroup, 'date', this.errors['date']);
  }

  get cdnError() {
    return getErrorMessage(this.formGroup, 'cdn', this.errors['cdn']);
  }
  get customerError() {
    return getErrorMessage(this.formGroup, 'customer', this.errors['customer']);
  }

  get shipmentsError() {
    return getErrorMessage(
      this.formGroup,
      'shipments',
      this.errors['shipments'],
    );
  }

  get productError() {
    return getErrorMessage(this.shipments, 'product', this.errors['product']);
  }

  get quantityError() {
    return getErrorMessage(this.shipments, 'quantity', this.errors['quantity']);
  }

  get typeError() {
    return getErrorMessage(this.formGroup, 'type', this.errors['type']);
  }

  get destinationError() {
    return getErrorMessage(
      this.formGroup,
      'destination',
      this.errors['destination'],
    );
  }

  get bonError() {
    return getErrorMessage(this.formGroup, 'bon', this.errors['bon']);
  }

  get travelsError() {
    return getErrorMessage(this.formGroup, 'travels', this.errors['travels']);
  }

  onSubmit(e: any) {
    console.log(e);
    this.formGroup.markAllAsTouched();
    if (this.formGroup.invalid) return;
    this.submitEvent.emit();
  }

  filterCustomers(event: AutoCompleteCompleteEvent) {
    this.filteredCustomers = autoCompleteFilter(event, this.customers);
  }

  filterProducts(event: AutoCompleteCompleteEvent) {
    this.filteredProducts = autoCompleteFilter(event, this.products);
  }

  onAddShipment() {
    const shipment = new FormGroup({
      product: new FormControl(null, [Validators.required]),
      quantity: new FormControl(0, [Validators.required, Validators.min(0)]),
      cdn: new FormControl(null),
    });
    this.shipments.push(shipment);
  }

  onRemoveRow(index: number) {
    this.shipments.removeAt(index);
  }
}
