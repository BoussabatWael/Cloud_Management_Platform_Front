import { TestBed } from '@angular/core/testing';

import { AccessCredentialsService } from './access-credentials.service';

describe('AccessCredentialsService', () => {
  let service: AccessCredentialsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccessCredentialsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
