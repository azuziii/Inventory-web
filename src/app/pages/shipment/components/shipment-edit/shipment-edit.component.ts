import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { concatMap, of } from 'rxjs';
import { getDirtyValues } from '../../../../shared/utils/get-dity-values';
import { Shipment, ShipmentItem } from '../../models/shipment.model';
import { ShipmentService } from '../../services/shipment.service';
import { ShipmentCommonFormComponent } from '../shipment-common-form/shipment-common-form.component';

@Component({
  selector: 'app-shipment-edit',
  imports: [ShipmentCommonFormComponent],
  templateUrl: './shipment-edit.component.html',
  styleUrl: './shipment-edit.component.css',
})
export class ShipmentEditComponent implements OnInit {
  shipment!: Shipment;
  formGroup: FormGroup = new FormGroup({
    date: new FormControl(null, [Validators.required]),
    bon: new FormControl(0, [Validators.required, Validators.min(0)]),
    travels: new FormControl(1, [Validators.required, Validators.min(0)]),
    type: new FormControl(null, [Validators.required]),
    destination: new FormControl(null, [Validators.required]),
    customer: new FormControl(null, [Validators.required]),
    shipments: new FormArray(
      [],
      [Validators.required, Validators.minLength(1)],
    ),
    id: new FormControl(null),
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    protected readonly shipmentService: ShipmentService,
  ) {}

  ngOnInit(): void {
    this.shipmentService
      .getShipment(this.route.snapshot.paramMap.get('id')!)
      .subscribe({
        next: (response) => {
          this.shipment = response;
          this.formGroup.patchValue({
            ...response,
            date: new Date(response.date).toISOString().split('T')[0],
            customer: response.customer.name,
          });

          response.shipments.forEach((shipment) =>
            this.addExistingShipment(shipment),
          );

          if (response.errors && response.errors.length) {
            this.shipmentService.message = response.errors[0];
          }
        },
      });
  }

  onSubmit() {
    const values = getDirtyValues<Partial<Shipment>>(this.formGroup);
    if (Object.keys(values).length === 0) {
      this.router.navigate(['shipment']);
      return;
    }

    if (values.shipments) {
      of(...values.shipments)
        .pipe(
          concatMap((shipment) => {
            if (shipment?.id) {
              return this.shipmentService.editShipmentItem(shipment);
            } else {
              return this.shipmentService.createShipmentItem({
                ...shipment,
                shipment: this.formGroup.get('id')!.value,
              });
            }
          }),
        )
        .subscribe();
    }

    this.shipmentService
      .editShipment({
        ...values,
        id: this.shipment.id,
      })
      .subscribe({
        next: () => {
          this.router.navigate(['shipment']);
        },
      });
  }

  get shipments() {
    return this.formGroup.get('shipments') as FormArray;
  }

  addExistingShipment(
    values?: Partial<Pick<ShipmentItem, 'id' | 'product' | 'quantity' | 'cdn'>>,
  ) {
    const shipmentControls: { [key: string]: FormControl } = {
      product: new FormControl(values?.product || null, [Validators.required]),
      quantity: new FormControl(values?.quantity || 0, [
        Validators.required,
        Validators.min(0),
      ]),
      cdn: new FormControl(values?.cdn || null, [Validators.required]),
    };

    if (values?.id) {
      shipmentControls['id'] = new FormControl(values.id);
      shipmentControls['id'].markAsDirty();
    }

    // TODO: mark shipments as dirty when item added
    const shipment = new FormGroup(shipmentControls);
    this.shipments.push(shipment);
  }
}
