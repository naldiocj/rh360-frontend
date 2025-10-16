import { TestBed } from '@angular/core/testing';

import { AssociarDelituosoComDelituoService } from './associar-delituoso-com-delituoso.service';

describe('AssociarDelituosoComDelituoService', () => {
  let service: AssociarDelituosoComDelituoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssociarDelituosoComDelituoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
