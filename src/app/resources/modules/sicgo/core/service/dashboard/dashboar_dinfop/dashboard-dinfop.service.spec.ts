import { TestBed } from '@angular/core/testing';

import { DashboardDinfopService } from './dashboard-dinfop.service';

describe('DashboardDinfopService', () => {
  let service: DashboardDinfopService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardDinfopService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
