import { TestBed } from '@angular/core/testing';

import { BiconsultaService } from './biconsulta.service';

describe('BiconsultaService', () => {
  let service: BiconsultaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BiconsultaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
