import { TestBed } from '@angular/core/testing';

import { CoreAccountService } from './core-account.service';

describe('CoreAccountService', () => {
  let service: CoreAccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoreAccountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
