import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LentivirusPackagePageComponent } from './lentivirus-package-page.component';

describe('LentivirusPackagePageComponent', () => {
  let component: LentivirusPackagePageComponent;
  let fixture: ComponentFixture<LentivirusPackagePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LentivirusPackagePageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LentivirusPackagePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
