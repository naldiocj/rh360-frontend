import { TestBed } from '@angular/core/testing';

import { AssociarDelituosoOcorrenciaService } from './associar-delituoso-ocorrencia.service';

describe('AssociarDelituosoOcorrenciaService', () => {
  let service: AssociarDelituosoOcorrenciaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssociarDelituosoOcorrenciaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
