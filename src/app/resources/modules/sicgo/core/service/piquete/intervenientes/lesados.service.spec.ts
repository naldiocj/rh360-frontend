import { TestBed } from '@angular/core/testing';

import { LesadosService } from './lesados.service';

describe('LesadosService', () => {
  let service: LesadosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LesadosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
