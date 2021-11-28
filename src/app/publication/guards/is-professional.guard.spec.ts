import { TestBed } from '@angular/core/testing';

import { IsProfessionalGuard } from './is-professional.guard';

describe('IsProfessionalGuard', () => {
  let guard: IsProfessionalGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(IsProfessionalGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
