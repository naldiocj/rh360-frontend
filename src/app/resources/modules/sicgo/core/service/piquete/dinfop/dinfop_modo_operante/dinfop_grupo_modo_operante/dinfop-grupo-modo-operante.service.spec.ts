import { TestBed } from '@angular/core/testing';

import { DinfopGrupoModoOperanteService } from './dinfop-grupo-modo-operante.service';

describe('DinfopGrupoModoOperanteService', () => {
  let service: DinfopGrupoModoOperanteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DinfopGrupoModoOperanteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
