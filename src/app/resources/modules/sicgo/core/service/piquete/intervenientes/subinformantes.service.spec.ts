import { TestBed } from '@angular/core/testing';

import { SubinformantesService } from './subinformantes.service';

describe('SubinformantesService', () => {
  let service: SubinformantesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubinformantesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
