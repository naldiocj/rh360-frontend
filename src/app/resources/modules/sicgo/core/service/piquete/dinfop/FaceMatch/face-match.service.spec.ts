import { TestBed } from '@angular/core/testing';

import { FaceMatchService } from './face-match.service';

describe('FaceMatchService', () => {
  let service: FaceMatchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FaceMatchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
