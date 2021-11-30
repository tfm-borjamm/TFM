import { TestBed } from '@angular/core/testing';

import { ItsMeGuard } from './its-me.guard';

describe('ItsMeGuard', () => {
  let guard: ItsMeGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ItsMeGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
