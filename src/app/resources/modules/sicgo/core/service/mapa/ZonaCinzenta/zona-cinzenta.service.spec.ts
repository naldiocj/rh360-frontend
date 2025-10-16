import { TestBed } from '@angular/core/testing';

import { ZonaCinzentaService } from './zona-cinzenta.service';

describe('ZonaCinzentaService', () => {
  let service: ZonaCinzentaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZonaCinzentaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
