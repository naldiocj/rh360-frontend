import { TestBed } from '@angular/core/testing';

import { ArquivosdelituosoService } from './arquivosdelituoso.service';

describe('ArquivosdelituosoService', () => {
  let service: ArquivosdelituosoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArquivosdelituosoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
