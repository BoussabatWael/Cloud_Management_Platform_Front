import { TestBed } from '@angular/core/testing';

import { CloudProvidersAccountsService } from './cloud-providers-accounts.service';

describe('CloudProvidersAccountsService', () => {
  let service: CloudProvidersAccountsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CloudProvidersAccountsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
