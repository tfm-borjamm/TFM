import { TestBed } from '@angular/core/testing';

import { IsClientGuard } from './is-client.guard';

describe('IsClientGuard', () => {
  let guard: IsClientGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(IsClientGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
