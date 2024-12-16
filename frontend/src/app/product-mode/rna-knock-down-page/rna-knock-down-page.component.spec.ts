import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RnaKnockDownPageComponent } from './rna-knock-down-page.component';

describe('RnaKnockDownPageComponent', () => {
  let component: RnaKnockDownPageComponent;
  let fixture: ComponentFixture<RnaKnockDownPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RnaKnockDownPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RnaKnockDownPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
