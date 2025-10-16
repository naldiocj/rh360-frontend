import { TestBed } from '@angular/core/testing';

import { AcusadoService } from './acusado.service';

describe('AcusadoService', () => {
  let service: AcusadoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AcusadoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
