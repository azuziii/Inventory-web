import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentCommonFormComponent } from './shipment-common-form.component';

describe('ShipmentCommonFormComponent', () => {
  let component: ShipmentCommonFormComponent;
  let fixture: ComponentFixture<ShipmentCommonFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShipmentCommonFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShipmentCommonFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
