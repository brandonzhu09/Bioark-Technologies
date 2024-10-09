import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneKnockInPageComponent } from './gene-knock-in-page.component';

describe('GeneKnockInPageComponent', () => {
  let component: GeneKnockInPageComponent;
  let fixture: ComponentFixture<GeneKnockInPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GeneKnockInPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GeneKnockInPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
