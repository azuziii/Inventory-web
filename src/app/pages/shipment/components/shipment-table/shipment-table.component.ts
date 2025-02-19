import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { Column } from '../../../../shared/components/table/model/Column.model';
import { TableComponent } from '../../../../shared/components/table/table.component';
import { ShipmentService } from '../../services/shipment.service';

@Component({
  selector: 'app-shipment-table',
  imports: [TableComponent, AsyncPipe, CardComponent],
  templateUrl: './shipment-table.component.html',
  styleUrl: './shipment-table.component.css',
})
export class ShipmentTableComponent {
  constructor(
    protected readonly router: Router,
    protected readonly shipmentService: ShipmentService,
  ) {}

  columns: Column[] = [
    {
      header: 'date',
      field: 'date',
    },
    {
      header: 'Bon',
      field: 'bon',
    },
    {
      header: 'Travels',
      field: 'travels',
    },
    {
      header: 'Type',
      field: 'type',
    },
    {
      header: 'Destination',
      field: 'destination',
    },
    {
      header: 'Bon',
      field: 'bon',
    },
    {
      header: 'customer',
      field: 'customer',
      subfield: 'name',
    },
  ];
}
