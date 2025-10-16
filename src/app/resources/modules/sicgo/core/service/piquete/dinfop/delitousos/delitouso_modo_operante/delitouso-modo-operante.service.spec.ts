import { TestBed } from '@angular/core/testing';

import { DelitousoModoOperanteService } from './delitouso-modo-operante.service';

describe('DelitousoModoOperanteService', () => {
  let service: DelitousoModoOperanteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DelitousoModoOperanteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
