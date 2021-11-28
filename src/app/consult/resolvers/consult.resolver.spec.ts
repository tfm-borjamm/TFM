import { TestBed } from '@angular/core/testing';

import { ConsultResolver } from './consult.resolver';

describe('ConsultResolver', () => {
  let resolver: ConsultResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(ConsultResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
