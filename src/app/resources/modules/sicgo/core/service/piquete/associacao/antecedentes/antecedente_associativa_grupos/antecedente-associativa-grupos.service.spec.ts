import { TestBed } from '@angular/core/testing';

import { AntecedenteAssociativaGruposService } from './antecedente-associativa-grupos.service';

describe('AntecedenteAssociativaGruposService', () => {
  let service: AntecedenteAssociativaGruposService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AntecedenteAssociativaGruposService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
