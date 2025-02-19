import { Component } from '@angular/core';
import { ShipmentTableComponent } from './components/shipment-table/shipment-table.component';

@Component({
  selector: 'app-shipment',
  imports: [ShipmentTableComponent],
  templateUrl: './shipment.component.html',
  styleUrl: './shipment.component.css',
})
export class ShipmentComponent {}
