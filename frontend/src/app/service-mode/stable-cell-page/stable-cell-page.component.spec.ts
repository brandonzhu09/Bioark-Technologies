import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StableCellPageComponent } from './stable-cell-page.component';

describe('StableCellPageComponent', () => {
  let component: StableCellPageComponent;
  let fixture: ComponentFixture<StableCellPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StableCellPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StableCellPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
