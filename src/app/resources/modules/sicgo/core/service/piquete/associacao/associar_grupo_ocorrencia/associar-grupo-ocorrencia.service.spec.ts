import { TestBed } from '@angular/core/testing';

import { AssociarGrupoOcorrenciaService } from './associar-grupo-ocorrencia.service';

describe('AssociarGrupoOcorrenciaService', () => {
  let service: AssociarGrupoOcorrenciaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssociarGrupoOcorrenciaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
