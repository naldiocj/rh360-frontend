import { TestBed } from '@angular/core/testing';

import { FontesInformacaoService } from './fontes-informacao.service';

describe('FontesInformacaoService', () => {
  let service: FontesInformacaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FontesInformacaoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
