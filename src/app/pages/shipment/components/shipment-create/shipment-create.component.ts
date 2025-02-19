import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { getDirtyValues } from '../../../../shared/utils/get-dity-values';
import { getErrorMessage } from '../../../../shared/utils/get-error-message';
import { Customer } from '../../../customer/models/customer.model';
import { Product } from '../../../product/models/product.model';
import { Shipment } from '../../models/shipment.model';
import { ShipmentService } from '../../services/shipment.service';
import { ShipmentCommonFormComponent } from '../shipment-common-form/shipment-common-form.component';

@Component({
  selector: 'app-shipment-create',
  imports: [ShipmentCommonFormComponent],
  templateUrl: './shipment-create.component.html',
  styleUrl: './shipment-create.component.css',
})
export class ShipmentCreateComponent implements OnInit {
  getErrorMessage = getErrorMessage;
  customers!: Customer[];
  products!: Product[];
  filteredCustomers!: Customer[];
  filteredProducts!: Product[];
  formGroup: FormGroup = new FormGroup({
    date: new FormControl(new Date().toISOString().split('T')[0], [
      Validators.required,
    ]),
    bon: new FormControl(null, [Validators.required, Validators.min(0)]),
    travels: new FormControl(1, [Validators.required, Validators.min(0)]),
    type: new FormControl(null, [Validators.required]),
    destination: new FormControl(null, [Validators.required]),
    customer: new FormControl(null, [Validators.required]),
    shipments: new FormArray(
      [],
      [Validators.required, Validators.minLength(1)],
    ),
  });

  constructor(
    private router: Router,
    protected readonly shipmentService: ShipmentService,
  ) {}

  ngOnInit(): void {
    this.formGroup.get('date')!.markAsDirty();
    this.formGroup.get('travels')!.markAsDirty();
  }

  onSubmit(e: any) {
    const values = getDirtyValues<Shipment>(this.formGroup);
    this.shipmentService.createShipment(values).subscribe({
      next: (response) => {
        this.router.navigate(['shipment']);
      },
    });
  }
}
