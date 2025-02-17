import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceModePageComponent } from './service-mode-page.component';

describe('ServiceModePageComponent', () => {
  let component: ServiceModePageComponent;
  let fixture: ComponentFixture<ServiceModePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ServiceModePageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServiceModePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
