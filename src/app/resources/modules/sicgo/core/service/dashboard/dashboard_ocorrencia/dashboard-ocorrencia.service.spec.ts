import { TestBed } from '@angular/core/testing';

import { DashboardOcorrenciaService } from './dashboard-ocorrencia.service';

describe('DashboardOcorrenciaService', () => {
  let service: DashboardOcorrenciaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardOcorrenciaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
