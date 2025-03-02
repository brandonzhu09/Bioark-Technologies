import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignDiagramComponent } from './design-diagram.component';

describe('DesignDiagramComponent', () => {
  let component: DesignDiagramComponent;
  let fixture: ComponentFixture<DesignDiagramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DesignDiagramComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DesignDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
