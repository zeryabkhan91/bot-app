import { TestBed } from '@angular/core/testing';

import { SelectorServiceService } from './selector-service.service';

describe('SelectorServiceService', () => {
  let service: SelectorServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectorServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
