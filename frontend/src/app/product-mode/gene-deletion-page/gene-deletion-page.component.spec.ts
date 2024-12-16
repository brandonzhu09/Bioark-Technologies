import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneDeletionPageComponent } from './gene-deletion-page.component';

describe('GeneDeletionPageComponent', () => {
  let component: GeneDeletionPageComponent;
  let fixture: ComponentFixture<GeneDeletionPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GeneDeletionPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GeneDeletionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
