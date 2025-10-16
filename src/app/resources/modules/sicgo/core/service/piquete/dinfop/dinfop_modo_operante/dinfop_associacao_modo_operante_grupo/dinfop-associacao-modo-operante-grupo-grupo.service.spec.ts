import { TestBed } from '@angular/core/testing';

import { DinfopAssociacaoModoOperanteGrupoGrupoService } from './dinfop-associacao-modo-operante-grupo-grupo.service';

describe('DinfopAssociacaoModoOperanteGrupoGrupoService', () => {
  let service: DinfopAssociacaoModoOperanteGrupoGrupoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DinfopAssociacaoModoOperanteGrupoGrupoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
