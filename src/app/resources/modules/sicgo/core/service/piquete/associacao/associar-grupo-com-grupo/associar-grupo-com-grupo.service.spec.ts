import { TestBed } from '@angular/core/testing';

import { AssociarGrupoComGrupoService } from './associar-grupo-com-grupo.service';

describe('AssociarGrupoComGrupoService', () => {
  let service: AssociarGrupoComGrupoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssociarGrupoComGrupoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
