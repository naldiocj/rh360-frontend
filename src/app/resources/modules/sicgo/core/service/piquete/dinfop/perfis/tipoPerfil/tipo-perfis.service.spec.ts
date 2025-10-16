import { TestBed } from '@angular/core/testing';

import { TipoPerfisService } from './tipo-perfis.service';

describe('TipoPerfisService', () => {
  let service: TipoPerfisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoPerfisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
