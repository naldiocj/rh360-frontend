import { TestBed } from '@angular/core/testing';

import { InformantesService } from './informantes.service';

describe('InformantesService', () => {
  let service: InformantesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InformantesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
