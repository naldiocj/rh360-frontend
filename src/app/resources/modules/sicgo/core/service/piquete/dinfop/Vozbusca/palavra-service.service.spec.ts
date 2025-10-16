import { TestBed } from '@angular/core/testing';

import { PalavraServiceService } from './palavra-service.service';

describe('PalavraServiceService', () => {
  let service: PalavraServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PalavraServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
