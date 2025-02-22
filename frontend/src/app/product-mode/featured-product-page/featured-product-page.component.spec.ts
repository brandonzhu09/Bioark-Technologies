import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturedProductPageComponent } from './featured-product-page.component';

describe('FeaturedProductPageComponent', () => {
  let component: FeaturedProductPageComponent;
  let fixture: ComponentFixture<FeaturedProductPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FeaturedProductPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FeaturedProductPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
