import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentEditComponent } from './shipment-edit.component';

describe('ShipmentEditComponent', () => {
  let component: ShipmentEditComponent;
  let fixture: ComponentFixture<ShipmentEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShipmentEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShipmentEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
