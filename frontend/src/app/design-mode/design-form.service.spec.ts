import { TestBed } from '@angular/core/testing';

import { DesignFormService } from './design-form.service';

describe('DesignFormService', () => {
  let service: DesignFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DesignFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
