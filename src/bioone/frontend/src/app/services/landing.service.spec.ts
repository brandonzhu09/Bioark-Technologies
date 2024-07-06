import { TestBed } from '@angular/core/testing';

import { LandingPageService } from './landing.service';

describe('ProductService', () => {
  let service: LandingPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LandingPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
