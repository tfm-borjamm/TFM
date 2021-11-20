import { TestBed } from '@angular/core/testing';

import { ExistPublicationGuard } from './exist-publication.guard';

describe('ExistPublicationGuard', () => {
  let guard: ExistPublicationGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ExistPublicationGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
