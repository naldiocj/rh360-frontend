import { TestBed } from '@angular/core/testing';

import { DenunciaAnonimaService } from './denuncia-anonima.service';

describe('DenunciaAnonimaService', () => {
  let service: DenunciaAnonimaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DenunciaAnonimaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
