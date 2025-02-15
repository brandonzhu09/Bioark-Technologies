import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionSectionComponent } from './promotion-section.component';

describe('PromotionSectionComponent', () => {
  let component: PromotionSectionComponent;
  let fixture: ComponentFixture<PromotionSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PromotionSectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PromotionSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
