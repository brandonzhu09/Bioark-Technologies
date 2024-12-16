import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceDropdownComponent } from './service-dropdown.component';

describe('ServiceDropdownComponent', () => {
  let component: ServiceDropdownComponent;
  let fixture: ComponentFixture<ServiceDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ServiceDropdownComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServiceDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
