import { TestBed } from '@angular/core/testing';

import { FingerprintBService } from './fingerprint-b.service';

describe('FingerprintBService', () => {
  let service: FingerprintBService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FingerprintBService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
