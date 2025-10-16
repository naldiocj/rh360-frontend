import { TestBed } from '@angular/core/testing';

import { PerfisOperativoService } from './perfis-operativo.service';

describe('PerfisOperativoService', () => {
  let service: PerfisOperativoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PerfisOperativoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
