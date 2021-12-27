import { TestBed } from '@angular/core/testing';

import { PublicationResolver } from './publication.resolver';

describe('PublicationResolver', () => {
  let resolver: PublicationResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(PublicationResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
