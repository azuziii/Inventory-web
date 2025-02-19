import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderCommonFormComponent } from './order-common-form.component';

describe('OrderCommonFormComponent', () => {
  let component: OrderCommonFormComponent;
  let fixture: ComponentFixture<OrderCommonFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderCommonFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderCommonFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
