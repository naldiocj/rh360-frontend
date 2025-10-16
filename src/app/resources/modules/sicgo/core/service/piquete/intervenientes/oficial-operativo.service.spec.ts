import { TestBed } from '@angular/core/testing';

import { OficialOperativoService } from './oficial-operativo.service';

describe('OficialOperativoService', () => {
  let service: OficialOperativoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OficialOperativoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
