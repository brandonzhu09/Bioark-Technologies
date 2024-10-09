import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneKnockOutPageComponent } from './gene-knock-out-page.component';

describe('GeneKnockOutPageComponent', () => {
  let component: GeneKnockOutPageComponent;
  let fixture: ComponentFixture<GeneKnockOutPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GeneKnockOutPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GeneKnockOutPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
