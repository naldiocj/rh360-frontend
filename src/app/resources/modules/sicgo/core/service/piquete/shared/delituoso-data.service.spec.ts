import { TestBed } from '@angular/core/testing';

import { DelituosoDataService } from './delituoso-data.service';

describe('DelituosoDataService', () => {
  let service: DelituosoDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DelituosoDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
