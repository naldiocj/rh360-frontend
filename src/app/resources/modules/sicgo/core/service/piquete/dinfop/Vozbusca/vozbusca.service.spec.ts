import { TestBed } from '@angular/core/testing';

import { VozbuscaService } from './vozbusca.service';

describe('VozbuscaService', () => {
  let service: VozbuscaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VozbuscaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
