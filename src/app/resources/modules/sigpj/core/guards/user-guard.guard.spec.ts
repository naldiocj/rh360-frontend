import { TestBed } from '@angular/core/testing';

import { SigpjUserGuard } from './user-guard.guard';

describe('UserGuardGuard', () => {
  let guard: SigpjUserGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SigpjUserGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
