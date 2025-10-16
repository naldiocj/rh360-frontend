import { TestBed } from '@angular/core/testing';

import { DenunciaPublicaService } from './denuncia-publica.service';

describe('DenunciaPublicaService', () => {
  let service: DenunciaPublicaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DenunciaPublicaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
