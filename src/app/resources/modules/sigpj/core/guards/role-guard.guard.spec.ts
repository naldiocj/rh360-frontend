import { TestBed } from '@angular/core/testing';

import { SigpjRoleGuard } from './role-guard.guard';

describe('RoleGuardGuard', () => {
  let guard: SigpjRoleGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SigpjRoleGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
