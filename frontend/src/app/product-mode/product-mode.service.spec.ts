import { TestBed } from '@angular/core/testing';

import { ProductModeService } from './product-mode.service';

describe('ProductModeService', () => {
  let service: ProductModeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductModeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
