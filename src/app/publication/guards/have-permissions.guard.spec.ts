import { TestBed } from '@angular/core/testing';

import { HavePermissionsGuard } from './have-permissions.guard';

describe('HavePermissionsGuard', () => {
  let guard: HavePermissionsGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(HavePermissionsGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
