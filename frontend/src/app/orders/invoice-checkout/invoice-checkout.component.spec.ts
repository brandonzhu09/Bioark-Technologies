import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceCheckoutComponent } from './invoice-checkout.component';

describe('InvoiceCheckoutComponent', () => {
  let component: InvoiceCheckoutComponent;
  let fixture: ComponentFixture<InvoiceCheckoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InvoiceCheckoutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InvoiceCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
