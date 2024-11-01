import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearchBlogComponent } from './research-blog.component';

describe('ResearchBlogComponent', () => {
  let component: ResearchBlogComponent;
  let fixture: ComponentFixture<ResearchBlogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResearchBlogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResearchBlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
