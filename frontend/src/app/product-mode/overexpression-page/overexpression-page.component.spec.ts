import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverexpressionPageComponent } from './overexpression-page.component';

describe('OverexpressionPageComponent', () => {
  let component: OverexpressionPageComponent;
  let fixture: ComponentFixture<OverexpressionPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OverexpressionPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OverexpressionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
