import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomCloningPageComponent } from './custom-cloning-page.component';

describe('CustomCloningPageComponent', () => {
  let component: CustomCloningPageComponent;
  let fixture: ComponentFixture<CustomCloningPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomCloningPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomCloningPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
