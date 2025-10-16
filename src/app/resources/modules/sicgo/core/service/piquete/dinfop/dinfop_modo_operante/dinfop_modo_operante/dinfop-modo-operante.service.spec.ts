import { TestBed } from '@angular/core/testing';

import { DinfopModoOperanteService } from './dinfop-modo-operante.service';

describe('DinfopModoOperanteService', () => {
  let service: DinfopModoOperanteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DinfopModoOperanteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
