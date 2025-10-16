import { TestBed } from '@angular/core/testing';

import { AntecedentesGrupoService } from './antecedentes-grupo.service';

describe('AntecedentesGrupoService', () => {
  let service: AntecedentesGrupoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AntecedentesGrupoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
