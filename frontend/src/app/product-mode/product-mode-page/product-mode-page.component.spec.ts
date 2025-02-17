import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductModePageComponent } from './product-mode-page.component';

describe('ProductModePageComponent', () => {
  let component: ProductModePageComponent;
  let fixture: ComponentFixture<ProductModePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductModePageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductModePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
