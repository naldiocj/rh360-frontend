import { TestBed } from '@angular/core/testing';

import { DetidosService } from './detidos.service';

describe('DetidosService', () => {
  let service: DetidosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetidosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
