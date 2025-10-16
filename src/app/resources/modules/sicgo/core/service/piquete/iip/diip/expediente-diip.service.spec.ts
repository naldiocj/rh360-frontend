import { TestBed } from '@angular/core/testing';

import { ExpedienteDiipService } from './expediente-diip.service';

describe('ExpedienteDiipService', () => {
  let service: ExpedienteDiipService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpedienteDiipService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
